import { NextResponse } from "next/server";

import { getDb } from "@/libs/db";

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.engagements);
}
