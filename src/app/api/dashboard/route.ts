import Enquiry from "@/models/Enquiry";
import Product from "@/models/Product";
import ProductUser from "@/models/ProductUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        let startDate: Date | null = null;
        let endDate: Date | null = null;

        if (startDateParam && endDateParam) {
            try {
                startDate = new Date(startDateParam);
                endDate = new Date(endDateParam);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
                }


            } catch (error) {
                return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
            }
        }

        let createdAtFilter = {};

        if (startDate && endDate) {
            createdAtFilter = {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            };
        }


        // 2,4,5,8,9,10: Aggregate function to filter enquiries based on analysisTable dates and status transitions.

        const aggregateEnquiries = async (newStatus: string | null) => {
            let matchStage: any = {};
            if (startDate && endDate) {
                matchStage = {
                    'analysisTable.date': { $gte: startDate, $lte: endDate },
                    'analysisTable.new': newStatus,
                };
            } else {
                matchStage = {
                    'analysisTable.new': newStatus
                };
            }


            const result = await Enquiry.aggregate([
                { $unwind: "$analysisTable" },
                { $match: matchStage },
                { $group: { _id: "$_id" } },  // Remove duplicate entries for the same enquiry
                { $count: "total" }  // Count total unique enquiries
            ]);

            return result.length > 0 ? result[0].total : 0;
        };

        // 1. Total Products Listed (with date filter applied to createdAt)
        const totalProducts = await Product.countDocuments(createdAtFilter);

        // 6. Total Users (with date filter applied to createdAt)
        const totalUsers = await ProductUser.countDocuments({ ...createdAtFilter, type: "user" });
      
        // 3: Total Enquiries (with date filter applied to createdAt)
        const totalEnquiries = await Enquiry.countDocuments(createdAtFilter);

        const totalOrdersPaymentUploaded = await aggregateEnquiries("Slip Submited")
        const pendingOrdersNoPayment = await aggregateEnquiries("Quotation Received");
        const pendingQuotations = await aggregateEnquiries("Pending");
        const deliveredOrders = await aggregateEnquiries("Delivered");
        const waitingForShipment = await aggregateEnquiries("Preparing For Shipment");
        const pendingPayments = await aggregateEnquiries("Quotation Received");
        const shippedOrders = await aggregateEnquiries("Product Shipped");


        // 7:Pending Payments: Quotation sent but Payment is pending (status:"Quotation Received" and paymentSlip is not exists)
        // const pendingPayments = await Enquiry.countDocuments({
        //     status: "Quotation Received",
        //     paymentSlip: { $exists: false }
        // });


        return NextResponse.json(
            {
                totalProducts,
                totalOrdersPaymentUploaded,
                totalEnquiries,
                pendingOrdersNoPayment,
                pendingQuotations,
                totalUsers,
                pendingPayments,
                waitingForShipment,
                shippedOrders,
                deliveredOrders
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in GET /api/product:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching the data." },
            { status: 500 }
        );
    }
}