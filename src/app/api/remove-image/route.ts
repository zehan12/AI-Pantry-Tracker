import cloudinaryV2 from "@/config/upload";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const payload = await request.json();
    const { publicId } = payload;

    try {
        await cloudinaryV2.uploader.destroy(publicId);
        return NextResponse.json({ message: "image removed" });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: "delete operation failed" });
    }
}
