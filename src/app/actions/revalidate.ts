"use server";

import { revalidatePath } from "next/cache";

export async function revalidateBoard(boardPath: string) {
  revalidatePath(boardPath, "layout");
}
