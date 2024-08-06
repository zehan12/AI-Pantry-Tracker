import { connectToMongoDB } from "@/config/db";
import { Pantry } from "@/models/pantry.schema";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const payload = await request.json();
    console.log(id,payload)
    connectToMongoDB();
    const item = await Pantry.findByIdAndUpdate(id, payload, { new: true });
    return NextResponse.json({ item });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    connectToMongoDB();
    const item = await Pantry.findByIdAndDelete(id);
    return NextResponse.json({ item });
}
