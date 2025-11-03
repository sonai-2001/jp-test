// @/app/api/homepage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/uploadS3";
import HomePage from "@/models/Home";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const homeData: Record<string, any> = {};
    const files: Record<string, Blob> = {};

    // Separate files and text data
    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        files[key] = value;
      } else {
        homeData[key] = value;
      }
    }

    // ✅ Handle Overview section
    homeData.overview = homeData.overview || {};

    // Overview heading & subheading
    if (homeData.overviewHeading) {
      homeData.overview.heading = homeData.overviewHeading;
    }
    if (homeData.overviewSubheading) {
      homeData.overview.subheading = homeData.overviewSubheading;
    }

    // Overview Image 1
    if (files.overviewImage1) {
      homeData.overview.image1 = await uploadToS3(
        files.overviewImage1 as File,
        "home"
      );
    } else if (homeData.overviewImage1Url) {
      homeData.overview.image1 = homeData.overviewImage1Url;
    }
    if (homeData.overviewImage1Alt) {
      homeData.overview.image1Alt = homeData.overviewImage1Alt;
    }

    // Overview Image 2
    if (files.overviewImage2) {
      homeData.overview.image2 = await uploadToS3(
        files.overviewImage2 as File,
        "home"
      );
    } else if (homeData.overviewImage2Url) {
      homeData.overview.image2 = homeData.overviewImage2Url;
    }
    if (homeData.overviewImage2Alt) {
      homeData.overview.image2Alt = homeData.overviewImage2Alt;
    }

    // ✅ Handle Solutions (array of strings)
    if (homeData.solutions) {
      const parsedSolutions = JSON.parse(homeData.solutions);
      // Validate max 6 items, each max 50 chars
      const validSolutions = parsedSolutions.slice(0, 6);

      homeData.solutions = validSolutions;
    }

    // ✅ Handle Stats counts
    if (homeData.experienceYears) {
      homeData.experienceYears = parseInt(homeData.experienceYears);
    }
    if (homeData.productsCount) {
      homeData.productsCount = parseInt(homeData.productsCount);
    }
    if (homeData.satisfiedCustomerCount) {
      homeData.satisfiedCustomerCount = parseInt(
        homeData.satisfiedCustomerCount
      );
    }

    // ✅ Handle Why Jaypee Associates (array of objects with images)
    if (homeData.whyJaypeeAssociates) {
      const parsedWhy = JSON.parse(homeData.whyJaypeeAssociates);
      const updatedWhy = [];

      for (let i = 0; i < Math.min(parsedWhy.length, 6); i++) {
        const item = parsedWhy[i];
        const imageKey = `whyJaypeeAssociates[${i}][image]`;

        // Validate content max 30 chars
        // if (item.content) {
        //   item.content = item.content.slice(0, 30);
        // }

        // Handle image upload
        if (files[imageKey]) {
          item.image = await uploadToS3(files[imageKey] as File, "home");
        } else if (
          typeof item.image === "string" &&
          item.image.startsWith("http")
        ) {
          // Keep existing image
        } else {
          item.image = "";
        }

        // Handle image alt
        if (item.imageAlt) {
          item.imageAlt = item.imageAlt;
        }

        updatedWhy.push(item);
      }
      homeData.whyJaypeeAssociates = updatedWhy;
    }

    if (homeData.clientImages) {
      const parsedClientImages = JSON.parse(homeData.clientImages);
      const updatedClientImages = [];

      for (let i = 0; i < Math.min(parsedClientImages.length, 6); i++) {
        const item = parsedClientImages[i];
        const imageKey = `clientImages[${i}]`;

        // Validate content max 30 chars
        // if (item.content) {
        //   item.content = item.content.slice(0, 30);
        // }

        // Handle image upload
        if (files[imageKey]) {
          item.image = await uploadToS3(files[imageKey] as File, "home");
        } else if (
          typeof item.image === "string" &&
          item.image.startsWith("http")
        ) {
          // Keep existing image
        } else {
          item.image = "";
        }

        // Handle image alt
        if (item.imageAlt) {
          item.imageAlt = item.imageAlt;
        }

        updatedClientImages.push(item);
      }
      homeData.clientImages = updatedClientImages;
    }

    // ✅ Check if HomePage exists
    const existing = await HomePage.findOne();

    if (existing) {
      Object.assign(existing, homeData);
      const updated = await existing.save();
      return NextResponse.json(
        {
          status: true,
          message: "Home page updated successfully",
          data: updated,
        },
        { status: 200 }
      );
    } else {
      const created = new HomePage(homeData);
      const saved = await created.save();
      return NextResponse.json(
        {
          status: true,
          message: "Home page created successfully",
          data: saved,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error saving home page:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Failed to save home page",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const home = await HomePage.findOne();
    return NextResponse.json(home || {}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
