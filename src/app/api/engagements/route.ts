import { NextResponse } from "next/server";

import { fetchQuery } from "convex/nextjs";

import { api } from "../../../../convex/_generated/api";

export async function GET() {
  const engagements = await fetchQuery(api.mvp.getEngagements);
  return NextResponse.json(engagements);
}
