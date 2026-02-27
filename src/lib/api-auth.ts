import { cookies } from "next/headers";

export async function checkApiAuth(req: Request) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  const authHeader = req.headers.get("authorization");
  const apiKey = req.headers.get("x-api-key");
  const envKey =
    process.env.API_SECRET_KEY || process.env.NEXT_PUBLIC_WEBSITE_SIGNING_KEY;

  const isValidAuthHeader = envKey && authHeader === `Bearer ${envKey}`;
  const isValidApiKey = envKey && apiKey === envKey;

  // We also check for an internal header optionally, or just use the API_SECRET_KEY.
  return isAdmin || isValidAuthHeader || isValidApiKey;
}
