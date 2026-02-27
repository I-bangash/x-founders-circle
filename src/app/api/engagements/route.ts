import { NextResponse } from "next/server";

import { fetchQuery } from "convex/nextjs";

import { checkApiAuth } from "@/lib/api-auth";

import { api } from "../../../../convex/_generated/api";

export async function GET(req: Request) {
  if (!(await checkApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const engagements = await fetchQuery(api.mvp.getEngagements);
  return NextResponse.json(engagements);
}
