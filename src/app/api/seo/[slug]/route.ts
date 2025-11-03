import { NextRequest, NextResponse } from 'next/server';
import Seo from '@/models/Seo';
import { connectToDatabase } from '@/lib/mongodb';
import { uploadToS3 } from '@/lib/uploadS3';
import Category from '@/models/Category';
import Brand from '@/models/Brand';
import Product from '@/models/Product';
import Redirect from '@/models/Redirect';
import { staticPages } from '@/app/admin/seo/staticPages';
import Industry from '@/models/Industry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizePath(p: string) {
  return String(p || '').trim().replace(/^\/+|\/+$/g, '');
}

function slugifyStrict(input: string) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/* GET /api/seo/[slug]
   - 404 if slug not found in products/categories/brands
   - 200 {} if entity exists but no SEO doc yet
*/
const STATIC_SLUGS = new Set<string>(
  staticPages.map((p) => normalizePath(p.slug))
);
STATIC_SLUGS.add('landing-page');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectToDatabase();

  const resolvedParams = await params;
  const paramSlug = normalizePath(resolvedParams.slug || '');
  if (!paramSlug) {
    return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
  }

  // Must exist in one of the entity collections
  // const [isCategory, isProduct, isBrand] = await Promise.all([
  //   Category.findOne({ slug: paramSlug }).lean(),
  //   Product.findOne({ slug: paramSlug }).lean(),
  //   Brand.findOne({ slug: paramSlug }).lean(),
  // ]);
  // if (!isCategory && !isProduct && !isBrand) {
  //   return NextResponse.json(
  //     { error: `Slug "${paramSlug}" does not exist in products, categories, or brands.` },
  //     { status: 404 }
  //   );
  // }

  const seo = await Seo.findOne({ slug: paramSlug });
  return NextResponse.json(seo || {}, { status: 200 });
}

/* POST /api/seo/[slug]
   - 404 if param slug not found in products/categories/brands
   - Creates/updates SEO; if slug changes, updates entity + redirects
*/
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Fixed: Added Promise wrapper
) {
  await connectToDatabase();

  const resolvedParams = await params; // Fixed: Await the params
  const paramSlug = normalizePath(resolvedParams.slug); // Fixed: Use resolved params

  // Parse body
  let data: any = {};
  let ogImageUrl = '';
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (key === 'ogImageFile' && value instanceof Blob) {
        ogImageUrl = await uploadToS3(value, 'seo-og-images');
      } else {
        data[key] = value;
      }
    }
    if (ogImageUrl) data.ogImage = ogImageUrl;
  } else {
    data = await request.json();
  }

  // Slugify new slug (or fallback)
  const newSlugRaw = data.slug ?? paramSlug;
  const newSlug = slugifyStrict(newSlugRaw);
  if (!newSlug) {
    return NextResponse.json(
      { error: 'Slug cannot be empty. Use letters, numbers and hyphens only.' },
      { status: 400 }
    );
  }
  data.slug = newSlug;

  // Must exist in one of the entity collections (validate the param slug)
  const [isCategory, isProduct, isBrand, isIndustry] = await Promise.all([
    Category.findOne({ slug: paramSlug }),
    Product.findOne({ slug: paramSlug }),
    Brand.findOne({ slug: paramSlug }),
    Industry.findOne({ slug: paramSlug }),
  ]);
  const isStatic = STATIC_SLUGS.has(paramSlug);

  if (!isCategory && !isProduct && !isBrand && !isIndustry && !isStatic) {
    return NextResponse.json(
      { error: `Slug "${paramSlug}" does not exist in products, categories, brands, industries, or static pages.` },
      { status: 404 }
    );
  }

  // Determine prefix for redirects
  let prefix: 'categories' | 'products' | 'brands' | 'industries' | null = null;
  if (isCategory) prefix = 'categories';
  else if (isProduct) prefix = 'products';
  else if (isBrand) prefix = 'brands';
  else if (isIndustry) prefix = 'industries';

  const fromPath = prefix ? `${prefix}/${paramSlug}` : paramSlug;
  const toPath = prefix ? `${prefix}/${newSlug}` : newSlug;

  const slugChanged = newSlug !== paramSlug;

  // Uniqueness across entities when slug changes (now includes Industry)
  if (slugChanged) {
    const [product, category, brand, industry] = await Promise.all([
      Product.findOne({ slug: newSlug }),
      Category.findOne({ slug: newSlug }),
      Brand.findOne({ slug: newSlug }),
      Industry.findOne({ slug: newSlug }),
    ]);
    if (product || category || brand || industry) {
      return NextResponse.json(
        { error: 'This slug is already in use. Please choose a different slug.' },
        { status: 400 }
      );
    }
  }

  // Upsert SEO doc with sanitized slug
  const seo = await Seo.findOneAndUpdate(
    { slug: paramSlug },
    { ...data, slug: newSlug },
    { upsert: true, new: true }
  );

  // If slug changed: update entity + redirects
  if (slugChanged) {
    if (isProduct) {
      await Product.findOneAndUpdate({ slug: paramSlug }, { slug: newSlug });
    } else if (isCategory) {
      await Category.findOneAndUpdate({ slug: paramSlug }, { slug: newSlug });
    } else if (isBrand) {
      await Brand.findOneAndUpdate({ slug: paramSlug }, { slug: newSlug });
    } else if (isIndustry) {
      await Industry.findOneAndUpdate({ slug: paramSlug }, { slug: newSlug });
    }

    // Redirects only make sense with a known prefix
    if (prefix) {
      // 1) Avoid loops: remove any redirect that starts at the new path
      await Redirect.deleteMany({ from: toPath });

      // 2) Flatten chains: anything pointing to the old path should now point to the new path
      await Redirect.updateMany(
        { to: fromPath },
        { $set: { to: toPath, updatedAt: new Date() } }
      );

      // 3) Upsert direct mapping old -> new (301)
      await Redirect.findOneAndUpdate(
        { from: fromPath },
        { from: fromPath, to: toPath, type: '301', updatedAt: new Date() },
        { upsert: true }
      );
    }
  }

  return NextResponse.json({
    ok: true,
    slugChanged,
    entityType: prefix, // will be 'industries' for industry slugs
    redirect: slugChanged && prefix ? { from: fromPath, to: toPath } : null,
    seo,
  });
}