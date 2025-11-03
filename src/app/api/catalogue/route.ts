import { uploadToS3 } from "@/lib/uploadS3";
import Catalogue from "@/models/Catalogue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cataloguesData: Record<string, any> = {};
    let catalogueFileFile: any = null;
    let catalogueImageFile: any = null;
    
    for (const [key, value] of formData.entries()) {
      if (key === "catalogueImage" && value instanceof Blob) {
        catalogueImageFile = value;
      } else if (key === "catalogueFile" && value instanceof Blob) {
        catalogueFileFile = value;
      } else {
        cataloguesData[key] = value;
      }
    }

    // Upload catalogues image to S3
    const catalogueFileUrl = catalogueFileFile ? await uploadToS3(catalogueFileFile, "catalogues") : null;
    if (catalogueFileUrl) {
      cataloguesData.catalogueFile = catalogueFileUrl;
    }

    // Upload catalogues image to S3
    const catalogueImageUrl = catalogueImageFile ? await uploadToS3(catalogueImageFile, "catalogues") : null;
    if (catalogueImageUrl) {
      cataloguesData.catalogueImage = catalogueImageUrl;
    }

    const newCatalogue = new Catalogue(cataloguesData);
    await newCatalogue.save();
    return NextResponse.json(
      {
        status: true,
        message: "Catalogue created successfully",
        data: newCatalogue,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to create catalogue",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const catalogueData: Record<string, any> = {};
    let catalogueFile: any = null;
    let catalogueImageFile: any = null;
    let id: string | null = null;

    for (const [key, value] of formData.entries()) {
      if (key === "id") {
        id = value as string;
      } else if (key === "catalogueFile" && value instanceof Blob) {
        catalogueFile = value;
      } else if (key === "catalogueImage" && value instanceof Blob) {
        catalogueImageFile = value;
      } else {
        catalogueData[key] = value;
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Catalogue ID is required." },
        { status: 400 }
      );
    }

    const existingCatalogue = await Catalogue.findById(id);
    if (!existingCatalogue) {
      return NextResponse.json(
        { status: false, message: "Catalogue not found" },
        { status: 404 }
      );
    }

    // Upload catalogue file to S3
    const catalogueFileUrl = catalogueFile ? await uploadToS3(catalogueFile, "catalogues") : null;
    if (catalogueFileUrl) {
      catalogueData.catalogueFile = catalogueFileUrl;
    }
    // Upload catalogues image to S3
    const catalogueImageUrl = catalogueImageFile ? await uploadToS3(catalogueImageFile, "catalogues") : null;
    if (catalogueImageUrl) {
      catalogueData.catalogueImage = catalogueImageUrl;
    }

    Object.assign(existingCatalogue, catalogueData);
    await existingCatalogue.save();

    return NextResponse.json(
      {
        status: true,
        message: "Catalogue updated successfully",
        data: existingCatalogue,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update catalogue",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const catalogueData = await Catalogue.findById(id);
      if (!catalogueData) {
        return NextResponse.json(
          { error: "Catalogue not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(catalogueData, { status: 200 });
    } else {
      const catalogueData = await Catalogue.find().sort({ createdAt: -1 });
      return NextResponse.json(catalogueData, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const catalogueData = await Catalogue.findById(id);
    if (!catalogueData) {
      return NextResponse.json(
        { success: false, message: "Catalogue not found" },
        { status: 404 }
      );
    }
    const deletedCatalogue = await Catalogue.findByIdAndDelete(id);
    return NextResponse.json(
      {
        status: true,
        message: "Catalogue deleted successfully",
        data: deletedCatalogue,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
