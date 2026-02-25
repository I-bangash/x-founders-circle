import { Metadata } from "next";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login | Founders on X",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="dark:bg-black/95">{children}</div>;
}
