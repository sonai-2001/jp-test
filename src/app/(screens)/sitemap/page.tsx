import Link from "next/link";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import { staticUrls } from "@/app/sitemap.xml/staticSitemaps";
import { connectToDatabase } from "@/lib/mongodb";

export const revalidate = 86400; // 1 day

export default async function SitemapPage() {
  await connectToDatabase();

  const [products, brands, categories] = await Promise.all([
    Product.find().select("slug"),
    Brand.find().select("slug"),
    Category.find().select("slug"),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-30">
      <h1 className="text-4xl font-bold mb-8">Sitemap</h1>

      <Section title="Pages">
        <InlineLinks>
          {staticUrls.map((page) => (
            <SitemapLink
              key={page.loc}
              href={page.loc}
              label={page.loc.replace(/^https?:\/\/[^/]+/, "") || "/"}
            />
          ))}
        </InlineLinks>
      </Section>

      <Section title="Categories">
        <InlineLinks>
          {categories.map((cat) => (
            <SitemapLink
              key={cat.slug}
              href={`/products/category/${cat.slug}`}
              label={formatLabel(cat.slug)}
            />
          ))}
        </InlineLinks>
      </Section>

      <Section title="Brands">
        <InlineLinks>
          {brands.map((brand) => (
            <SitemapLink
              key={brand.slug}
              href={`/products/brand/${brand.slug}`}
              label={formatLabel(brand.slug)}
            />
          ))}
        </InlineLinks>
      </Section>

      <Section title="Products">
        <InlineLinks>
          {products.map((prod) => (
            <SitemapLink
              key={prod.slug}
              href={`/products/${prod.slug}`}
              label={formatLabel(prod.slug)}
            />
          ))}
        </InlineLinks>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {children}
    </section>
  );
}

function InlineLinks({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
      {children}
    </div>
  );
}

function SitemapLink({ href, label }: { href: string; label: string }) {
  return (
    <>
      <Link
        href={href}
        className="text-blue-700 hover:underline text-base break-words"
        // style={{ whiteSpace: "nowrap" }} // REMOVE this line!
      >
        {label}
      </Link>
      <span className="text-gray-400">|</span>
    </>
  );
}

function formatLabel(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}