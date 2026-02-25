import { NextResponse } from "next/server";

import { getDb, saveDb } from "@/libs/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const db = getDb();

  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Delete post
  db.posts = db.posts.filter((p) => p.id !== id);

  // Delete engagements
  db.engagements = db.engagements.filter((e) => e.postId !== id);

  saveDb(db);

  return NextResponse.json({ success: true });
}
