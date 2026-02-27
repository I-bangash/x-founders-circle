import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  // Redirect to the actual dashboard
  redirect("/dashboard-v2");
}
