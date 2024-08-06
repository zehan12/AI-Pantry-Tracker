import { PantryItem } from "@/app/pantry/page";
import { connectToMongoDB } from "@/config/db";
import { Pantry } from "@/models/pantry.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    const { userId } = params;

    connectToMongoDB();

    const totalItems = await Pantry.find({
        userId,
    });
    
    const ingredients = totalItems.map((item) => item.name).join(", ");
    return NextResponse.json({ ingredients });
}
