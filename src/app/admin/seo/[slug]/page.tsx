"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { getSeoBySlug } from "@/app/services/seo/SeoApi";
import useToast from "@/util/toast";
import { staticPages } from "../staticPages";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import { useRouter } from "next/navigation";

interface SeoFormData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  contentDescription: string;
  slug: string;
}

const defaultValues: SeoFormData = {
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogImageWidth: undefined,
  ogImageHeight: undefined,
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  contentDescription: "",
  slug: "",
};

// While typing: allow letters, numbers, and "-" (no other specials). Keep trailing "-".
// Collapse multiple "-" and strip leading "-".
function slugifyLoose(input: string) {
  return String(input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-") // only "-" is allowed as special
    .replace(/-{2,}/g, "-")       // collapse "--" -> "-"
    .replace(/^-+/, "");          // no leading "-"
}

// Finalize before save: trim leading/trailing "-" too.
function slugifyFinal(input: string) {
  return slugifyLoose(input).replace(/^-+|-+$/g, "");
}

function isContentEmpty(html: string) {
  const cleaned = html
    .replace(/<p><br><\/p>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/gi, "")
    .replace(/\s+/g, "");
  return !cleaned || cleaned === "";
}

const SeoManagePage = () => {
  const params = useParams();
  const urlSlug = (params as { slug: string }).slug;
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
  const router=useRouter()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SeoFormData>({
    defaultValues,
    mode: "onChange", // validate while typing
  });

  const ogImageUrlValue = watch("ogImage");

  // --- Static slug logic ---
  const staticSlugs = staticPages.map((page) => page.slug);
  const isLandingPage = urlSlug === StaticPageSlug.LandingPage;
  const isStaticSlug = staticSlugs.includes(urlSlug) || isLandingPage;

  // Fetch SEO data for this slug
  useEffect(() => {
    const fetchSeo = async () => {
      setLoading(true);
      const seo = await getSeoBySlug(urlSlug);
      if (seo) {
        reset({
          metaTitle: seo.metaTitle || "",
          metaDescription: seo.metaDescription || "",
          canonicalUrl: seo.canonicalUrl || "",
          robots: seo.robots || "index, follow",
          ogTitle: seo.ogTitle || "",
          ogDescription: seo.ogDescription || "",
          ogImage: seo.ogImage || "",
          ogImageWidth: seo.ogImageWidth,
          ogImageHeight: seo.ogImageHeight,
          twitterTitle: seo.twitterTitle || "",
          twitterDescription: seo.twitterDescription || "",
          twitterImage: seo.twitterImage || "",
          contentDescription: seo.contentDescription || "",
          // Show "/" in the UI if landing-page, but keep "landing-page" in DB
          slug:
            seo.slug === StaticPageSlug.LandingPage && isLandingPage
              ? "/"
              : seo.slug || urlSlug,
        });
        if (seo.ogImage) setOgImagePreview(seo.ogImage);
      } else {
        reset({ ...defaultValues, slug: isLandingPage ? "/" : urlSlug });
        setOgImagePreview(null);
      }
      setOgImageFile(null);
      setLoading(false);
    };
    fetchSeo();
    // eslint-disable-next-line
  }, [urlSlug, reset]);

  const handleOgImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOgImageFile(file);
      setOgImagePreview(URL.createObjectURL(file));
      reset({ ...watch(), ogImage: "" }); // Clear URL if file is selected
    } else {
      setOgImageFile(null);
      setOgImagePreview(null);
    }
  };

  const handleRemoveOgImage = () => {
    setOgImageFile(null);
    setOgImagePreview(null);
    reset({ ...watch(), ogImage: "" });
  };

  // --- SUBMIT HANDLER ---
  const onSubmit = async (data: SeoFormData) => {
    // Clean contentDescription before sending
    let contentDescription = data.contentDescription;
    if (isContentEmpty(contentDescription)) {
      contentDescription = "";
    }

    // Prevent changing slug for static pages
    if (isStaticSlug && data.slug !== urlSlug && !isLandingPage) {
      showToast({
        type: "error",
        message: "You cannot change the slug for a static page.",
      });
      return;
    }

    if (ogImageFile && data.ogImage) {
      showToast({
        type: "error",
        message: "Please remove the existing image before uploading a new one.",
      });
      return;
    }

    try {
      let response;

      // Finalize slug on submit (trim edge "-" etc.) unless it's the landing page
      const finalizedSlug =
        isLandingPage ? StaticPageSlug.LandingPage : slugifyFinal(data.slug || urlSlug);

      if (ogImageFile) {
        const formData = new FormData();
        formData.append("slug", finalizedSlug);
        formData.append("metaTitle", data.metaTitle);
        formData.append("metaDescription", data.metaDescription);
        formData.append("canonicalUrl", data.canonicalUrl);
        formData.append("robots", data.robots);
        formData.append("ogTitle", data.ogTitle);
        formData.append("ogDescription", data.ogDescription);
        formData.append("ogImageFile", ogImageFile);
        if (data.ogImageWidth)
          formData.append("ogImageWidth", String(data.ogImageWidth));
        if (data.ogImageHeight)
          formData.append("ogImageHeight", String(data.ogImageHeight));
        formData.append("twitterTitle", data.twitterTitle);
        formData.append("twitterDescription", data.twitterDescription);
        formData.append("twitterImage", data.twitterImage);
        formData.append("contentDescription", contentDescription); // cleaned

        response = await fetch(`/api/seo/${urlSlug}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`/api/seo/${urlSlug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            slug: finalizedSlug, // use finalized slug
            contentDescription, // cleaned
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        showToast({
          type: "error",
          message: errorData.error || "Failed to save SEO data.",
        });
        return;
      }

      showToast({
        type: "success",
        message: "SEO data saved successfully.",
      });
       // Redirect back after success
    setTimeout(() => {
      router.back();
    }, 400);
    } catch (error: any) {
      showToast({
        type: "error",
        message: error?.response?.data?.error || "Failed to save SEO data.",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <section>
      <div className="container">
        <h2 className="mb-4">
          Manage SEO for <span className="text-primary">{urlSlug}</span>
        </h2>
        <Form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Slug (editable, or read-only for static pages) */}
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              inputMode="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="e.g. category-name"
              {...register("slug", {
                required: "This field is required",
                validate: (v) => {
                  if (isStaticSlug) return true; // read-only anyway
                  if (isLandingPage) return v === "/" || 'Landing page must be "/"';
                  // Allow trailing "-" while typing; only a-z, 0-9 and "-"
                  return (
                    /^[a-z0-9]+(?:-[a-z0-9]+)*-?$/.test(v) ||
                    "Use lowercase letters, numbers, and hyphens only"
                  );
                },
                onChange: (e) => {
                  if (isStaticSlug) return;
                  let sanitized = slugifyLoose(e.target.value);
                  // prevent a leading hyphen while typing
                  sanitized = sanitized.replace(/^-+/, "");
                  setValue("slug", sanitized, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                },
              })}
              value={isLandingPage ? "/" : watch("slug")}
              readOnly={isStaticSlug}
              style={isStaticSlug ? { background: "#f5f5f5", color: "#888" } : {}}
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault(); // block spacebar
              }}
              onBlur={() => {
                if (isStaticSlug) return;
                // finalize: trim edge hyphens
                const finalized = slugifyFinal(watch("slug"));
                setValue("slug", finalized, { shouldValidate: true, shouldDirty: true });
              }}
            />
            {isStaticSlug && (
              <small className="text-muted">
                This slug is for a static page and cannot be edited.
              </small>
            )}
            {errors.slug && (
              <span className="text-danger">
                {String(errors.slug.message || "This field is required")}
              </span>
            )}
          </Form.Group>

          {/* Content Description (SunEditor) */}
          <Form.Group className="mb-3" controlId="contentDescription">
            <Form.Label>Content Description</Form.Label>
            <Controller
              control={control}
              name="contentDescription"
              render={({ field }) => (
                <SunEditor
                  defaultValue={field.value}
                  onChange={field.onChange}
                  setOptions={{
                    height: "200",
                    buttonList: [
                      ["undo", "redo"],
                      ["formatBlock", "fontSize"],
                      ["bold", "underline", "italic", "strike"],
                      ["fontColor", "hiliteColor", "textStyle"],
                      ["removeFormat"],
                      ["outdent", "indent"],
                      ["align", "horizontalRule", "list", "table"],
                      ["link", "image", "video"],
                      ["codeView"],
                    ],
                  }}
                />
              )}
            />
            {errors.contentDescription && (
              <span className="text-danger">This field is required</span>
            )}
          </Form.Group>

          {/* --- The rest of your SEO fields --- */}
          <Form.Group className="mb-3" controlId="metaTitle">
            <Form.Label>Meta Title</Form.Label>
            <Form.Control
              type="text"
              {...register("metaTitle", { required: true })}
              placeholder="Enter meta title"
            />
            {errors.metaTitle && (
              <span className="text-danger">This field is required</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="metaDescription">
            <Form.Label>Meta Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              {...register("metaDescription", { required: true })}
              placeholder="Enter meta description"
            />
            {errors.metaDescription && (
              <span className="text-danger">This field is required</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="canonicalUrl">
            <Form.Label>Canonical URL</Form.Label>
            <Form.Control
              type="text"
              {...register("canonicalUrl")}
              placeholder="https://yourdomain.com/page"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="robots">
            <Form.Label>Robots</Form.Label>
            <Form.Select {...register("robots")}>
              <option value="index, follow">index, follow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, follow">noindex, follow</option>
            </Form.Select>
          </Form.Group>

          <hr />
          <h5>Open Graph (OG) Tags</h5>
          <Form.Group className="mb-3" controlId="ogTitle">
            <Form.Label>OG Title</Form.Label>
            <Form.Control type="text" {...register("ogTitle")} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="ogDescription">
            <Form.Label>OG Description</Form.Label>
            <Form.Control as="textarea" rows={2} {...register("ogDescription")} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="ogImage">
            <Form.Label>OG Image</Form.Label>
            <Form.Control
              type="text"
              {...register("ogImage")}
              placeholder="Paste OG image URL or upload below"
              disabled={!!ogImageFile}
            />
            <div className="mt-2">
              <Form.Label className="small">Or upload an image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleOgImageFile}
                disabled={!!ogImageUrlValue}
              />
            </div>
            {ogImagePreview && (
              <div className="mt-2">
                <img
                  src={ogImagePreview}
                  alt="OG Preview"
                  style={{ maxWidth: 200, maxHeight: 120 }}
                />
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-2"
                  onClick={handleRemoveOgImage}
                >
                  Remove
                </Button>
              </div>
            )}
          </Form.Group>

          <hr />
          <h5>Twitter Tags</h5>
          <Form.Group className="mb-3" controlId="twitterTitle">
            <Form.Label>Twitter Title</Form.Label>
            <Form.Control type="text" {...register("twitterTitle")} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="twitterDescription">
            <Form.Label>Twitter Description</Form.Label>
            <Form.Control as="textarea" rows={2} {...register("twitterDescription")} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="twitterImage">
            <Form.Label>Twitter Image URL</Form.Label>
            <Form.Control type="text" {...register("twitterImage")} />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save SEO"}
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default SeoManagePage;