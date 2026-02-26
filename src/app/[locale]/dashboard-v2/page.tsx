import { cookies } from "next/headers";

import AdminConsole from "./AdminConsole";
import LoginForm from "./LoginForm";

export default async function DashboardV2Page() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminConsole />;
}
