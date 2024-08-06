import { connectToMongoDB } from "@/config/db";
import { Pantry } from "@/models/pantry.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    const { userId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const search = url.searchParams.get("search") || "";

    // Fixed limit of 3 items per page
    const limit = 3;

    // Ensure page is a positive integer
    const currentPage = isNaN(page) || page < 1 ? 1 : page;

    connectToMongoDB();

    const skip = (currentPage - 1) * limit;

    try {
        const totalItems = await Pantry.countDocuments({
            userId,
            name: { $regex: search, $options: "i" }, // Case-insensitive search
        });

        const items = await Pantry.find({
            userId,
            name: { $regex: search, $options: "i" },
        })
            .skip(skip)
            .limit(limit)
            .exec();

        return NextResponse.json({
            items,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage,
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json(
            { error: "Failed to fetch items" },
            { status: 500 }
        );
    }
}
