import { redis } from "@/lib/redis";

const Page = async () => {
  const count = await redis.get<number>("count");
  return <p>count: {count}</p>;
};

export default Page;
