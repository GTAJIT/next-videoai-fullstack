// /app/api/test/route.ts
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ message: "MongoDB connection success ✅" });
  } catch (err) {
    return NextResponse.json({ error: "MongoDB connection failed ❌" });
  }
}
