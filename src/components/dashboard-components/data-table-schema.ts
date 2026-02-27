import { z } from "zod";

export const postSchema = z.object({
  id: z.string(), // Convex _id
  tweetId: z.string(),
  content: z.string(),
  createdAt: z.number(),
  status: z.enum(["published", "queued"]).optional(),
  engagementCount: z.number().optional(),
  authorUsername: z.string(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
