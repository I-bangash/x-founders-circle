import { NextResponse } from "next/server";

import { getDb, saveDb } from "@/libs/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const db = getDb();

  const user = db.users.find((u) => u.id === id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Delete user
  db.users = db.users.filter((u) => u.id !== id);

  // Delete engagements
  db.engagements = db.engagements.filter(
    (e) => e.twitterUserId !== user.twitterId
  );

  saveDb(db);

  return NextResponse.json({ success: true });
}
