import PAYMENT from "@/models/paymentMethod";
import { NextRequest, NextResponse } from "next/server";

// POST: Create a new payment method
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newPaymentMethod = new PAYMENT(data);
    await newPaymentMethod.save();
    return NextResponse.json(
      {
        status: true,
        message: "Payment method created successfully",
        data: newPaymentMethod,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to create payment method",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing payment method
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Payment method ID is required" },
        { status: 400 }
      );
    }

    const existingPaymentMethod = await PAYMENT.findById(id);
    if (!existingPaymentMethod) {
      return NextResponse.json(
        { status: false, message: "Payment method not found" },
        { status: 404 }
      );
    }

    Object.assign(existingPaymentMethod, updateData);
    await existingPaymentMethod.save();

    return NextResponse.json(
      {
        status: true,
        message: "Payment method updated successfully",
        data: existingPaymentMethod,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update payment method",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET: Fetch all payment methods or a single payment method
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const paymentMethod = await PAYMENT.findById(id);
      if (!paymentMethod) {
        return NextResponse.json({ error: "Payment method not found." }, { status: 404 });
      }
      return NextResponse.json({ data: paymentMethod }, { status: 200 });
    } else {
      const paymentMethods = await PAYMENT.find();
      return NextResponse.json({ data: paymentMethods }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an existing payment method
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const paymentMethod = await PAYMENT.findById(id);
    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method not found" },
        { status: 404 }
      );
    }
    const deletedPaymentMethod = await PAYMENT.findByIdAndDelete(id);
    return NextResponse.json(
      {
        status: true,
        message: "Payment method deleted successfully",
        data: deletedPaymentMethod,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
