import { connectToMongoDB } from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
    connectToMongoDB();
    return NextResponse.json({ data: "hello world" });
}
