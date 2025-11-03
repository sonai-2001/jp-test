import FAQ from "@/models/FAQS";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if the question already exists
    const existingFAQ = await FAQ.findOne({ question: body.question });
    if (existingFAQ) {
      return NextResponse.json(
        { status: false, message: "Question already exists" },
        { status: 400 }
      );
    }

    const newFAQ = new FAQ({
      question: body.question,
      answer: body.answer,
    });

    await newFAQ.save();
    return NextResponse.json(
      {
        status: true,
        message: "FAQ created successfully",
        data: newFAQ,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to create FAQ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, question, answer } = body;
    const existingFAQ = await FAQ.findById(id);
    if (!existingFAQ) {
      return NextResponse.json(
        { status: false, message: "FAQ not found" },
        { status: 404 }
      );
    }
    existingFAQ.question = question;
    existingFAQ.answer = answer;

    await existingFAQ.save();

    return NextResponse.json(
      {
        status: true,
        message: "FAQ updated successfully",
        data: existingFAQ,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update FAQ",
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
      const faqData = await FAQ.findById(id);
      if (!faqData) {
        return NextResponse.json(
          { error: "FAQ not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(faqData, { status: 200 });
    } else {
      const faqData = await FAQ.find().sort({ createdAt: -1 });
      return NextResponse.json(faqData, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const faqData = await FAQ.findById(id);
    if (!faqData) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 }
      );
    }
    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    return NextResponse.json(
      {
        status: true,
        message: "FAQ deleted successfully",
        data: deletedFAQ,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
