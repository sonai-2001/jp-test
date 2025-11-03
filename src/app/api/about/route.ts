import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/uploadS3";
import AboutPage from "@/models/about";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const aboutData: Record<string, any> = {};
    const files: Record<string, Blob> = {};

    // Separate files and text data
    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        files[key] = value;
      } else {
        aboutData[key] = value;
      }
    }

    // ✅ Handle story / mission / vision (same as before)
    // ✅ Handle story / mission / vision (with image URL fallback)
    const imageSections = ["story", "mission", "vision"];

    for (const section of imageSections) {
      aboutData[section] = aboutData[section] || {};

      // Content (always update)
      if (aboutData[`${section}Content`]) {
        aboutData[section].content = aboutData[`${section}Content`];
      }

      // Image handling (new upload or preserve existing)
      if (files[`${section}Image`]) {
        // 🆕 New file uploaded
        aboutData[section].image = await uploadToS3(
          files[`${section}Image`] as File,
          "about"
        );
      } else if (aboutData[`${section}ImageUrl`]) {
        // 🧩 Preserve existing image URL (from frontend)
        aboutData[section].image = aboutData[`${section}ImageUrl`];
      }

      // 🆕 Alt tag handling
      if (aboutData[`${section}AltTag`]) {
        aboutData[section].altTag = aboutData[`${section}AltTag`];
      }

    }

    // ✅ Handle approach (array of objects with image uploads)
    if (aboutData.approach) {
      const parsedApproach = JSON.parse(aboutData.approach);
      const updatedApproach = [];

      for (let i = 0; i < parsedApproach.length; i++) {
        const item = parsedApproach[i];
        const imageKey = `approach[${i}][image]`; // FormData key
        if (files[imageKey]) {
          const uploadedUrl = await uploadToS3(files[imageKey] as File, "about");
          item.image = uploadedUrl;
        } else if (
          typeof item.image === "string" &&
          item.image.startsWith("http")
        ) {
          // keep existing image if editing
        } else {
          item.image = "";
        }
        updatedApproach.push(item);
      }
      aboutData.approach = updatedApproach;
    }

    // ✅ Handle core values (array of objects with image)
    if (aboutData.coreValues) {
      const parsedCoreValues = JSON.parse(aboutData.coreValues);
      const updatedCore = [];

      for (let i = 0; i < parsedCoreValues.length; i++) {
        const item = parsedCoreValues[i];
        const imageKey = `coreValues[${i}][image]`;
        if (files[imageKey]) {
          const uploadedUrl = await uploadToS3(files[imageKey] as File, "about");
          item.image = uploadedUrl;
        } else if (
          typeof item.image === "string" &&
          item.image.startsWith("http")
        ) {
          // keep old image if present
        } else {
          item.image = "";
        }
        updatedCore.push(item);
      }
      aboutData.coreValues = updatedCore;
    }

    // ✅ Why choose us
    if (aboutData.whyChooseUsContent) {
      aboutData.whyChooseUs = aboutData.whyChooseUsContent;
    }

    // ✅ Check if AboutPage exists
    const existing = await AboutPage.findOne();

    if (existing) {
      Object.assign(existing, aboutData);
      const updated = await existing.save();
      return NextResponse.json(
        {
          status: true,
          message: "About page updated successfully",
          data: updated,
        },
        { status: 200 }
      );
    } else {
      const created = new AboutPage(aboutData);
      const saved = await created.save();
      return NextResponse.json(
        {
          status: true,
          message: "About page created successfully",
          data: saved,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error saving about page:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Failed to save about page",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const about = await AboutPage.findOne();
    return NextResponse.json(about || {}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
