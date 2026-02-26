import { redis } from "@/lib/redis";

export const GET = async () => {
  await redis.incr("count");

  return new Response("OK");
};
