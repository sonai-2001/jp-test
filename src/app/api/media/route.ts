import Media from "@/models/media";
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/uploadS3";
import { deleteFileFromS3 } from "@/lib/deleteFileFromS3";


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const mediaData: Record<string, any> = {};
    const mediaFiles: any[] = [];

    // Extract images from formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("images[") && value instanceof Blob) {
        mediaFiles.push(value);
      } else {
        mediaData[key] = value;
      }
    }

    // Upload media files to S3
    const mediaUrls = await Promise.all(
      mediaFiles.map(async (file: any) => await uploadToS3(file, "products"))
    );

    let savedMedia;

    const existingMedia = await Media.findOne();

    if (existingMedia) {
      // Append new images to existing media
      existingMedia.images = [ ...mediaUrls, ...(existingMedia.images || [])]; // Ensure images is an array
       Object.assign(existingMedia, mediaData); // update other fields as well
      savedMedia = await existingMedia.save();

    } else {
      // Create new media document
      mediaData.images = mediaUrls;
      const newMedia = new Media(mediaData);
      savedMedia = await newMedia.save();
    }

    return NextResponse.json(
      {
        status: true,
        message: "Images uploaded successfully",
        data: savedMedia,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to upload images",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const mediaData: Record<string, any> = {};
    const mediaFiles: any = [];
    let id: string | null = null;

    for (const [key, value] of formData.entries()) {
      if (key === "id") {
        id = value as string;
      } else if (key === "images" && value instanceof Blob) {
        mediaFiles.push(value);
      } else {
        mediaData[key] = value;
      }
    }

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Media ID is required" },
        { status: 400 }
      );
    }

    const existingMedia = await Media.findById(id);
    if (!existingMedia) {
      return NextResponse.json(
        { status: false, message: "Media not found" },
        { status: 404 }
      );
    }

    // Upload media files to S3
    const mediaUrls = await Promise.all(
      mediaFiles.map(async (file: any) => await uploadToS3(file, "products"))
    );

    // Attach uploaded images to media data
    mediaData.images = mediaUrls;

    Object.assign(existingMedia, mediaData);
    const updatedMedia = await existingMedia.save();

    return NextResponse.json(
      {
        status: true,
        message: "Images updated successfully",
        data: updatedMedia,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update images",
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
      const mediaData = await Media.findById(id);
      if (!mediaData) {
        return NextResponse.json(
          { error: "Media not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(mediaData, { status: 200 });
    } else {
      // const mediaData = await Media.find().sort({ createdAt: -1 });
      const mediaData = await Media.findOne();
      return NextResponse.json(mediaData, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json(
        { status: false, message: "fileUrl is required in the request body." },
        { status: 400 }
      );
    }

    const existingMedia = await Media.findOne();

    if (!existingMedia) {
      return NextResponse.json(
        { status: false, message: "No media entry found in the database." },
        { status: 404 }
      );
    }

    if (existingMedia.images && existingMedia.images.includes(fileUrl)) {
      existingMedia.images = existingMedia.images.filter((url) => url !== fileUrl); // Remove the image URL
      await existingMedia.save();  

    } else {
      return NextResponse.json(
        { status: false, message: "File URL not found in the media entry." },
        { status: 404 }
      );
    }
   

    // Extract the key (path) from the S3 URL
    const urlParts = fileUrl.split("/");
    const bucketName = urlParts[2].split(".")[0];
    const key = urlParts.slice(3).join("/");

    // Delete the file from S3
    await deleteFileFromS3(bucketName, key);

    return NextResponse.json(
      {
        status: true,
        message: "File deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Failed to delete file.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}