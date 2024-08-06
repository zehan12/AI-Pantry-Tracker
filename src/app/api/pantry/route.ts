import { connectToMongoDB } from "@/config/db";
import { Pantry } from "@/models/pantry.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    connectToMongoDB();
    const items = await Pantry.find();
    return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
    connectToMongoDB();
    const payload = await request.json();
    const pantryCreated = await Pantry.create(payload);
    return NextResponse.json({ data: pantryCreated });
}
