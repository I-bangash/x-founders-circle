"use server";

import { cookies } from "next/headers";

import { createHash } from "crypto";

export async function loginAdmin(password: string) {
  const hash = createHash("sha256").update(password).digest("hex");
  const envHash = process.env.ADMIN_PASSWORD_HASH;

  if (envHash && hash === envHash) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return true;
  }
  return false;
}
