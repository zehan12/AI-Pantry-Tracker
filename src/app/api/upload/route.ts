import cloudinaryV2 from "@/config/upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const image: any = formData.get("image");

    if (!image) {
        return NextResponse.json({ error: "No image provided" });
    }

    try {
        const result = await cloudinaryV2.uploader.upload(image, {
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        });
        return NextResponse.json({ data: result });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: "upload failed" });
    }
}
