"use client";

import { useState } from "react";

import { loginAdmin } from "./actions";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const success = await loginAdmin(password);
      if (success) {
        window.location.reload();
      } else {
        setError("Invalid password");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 font-['Inter',sans-serif]">
      <div className="border-border bg-card w-full max-w-md space-y-8 rounded-3xl border p-8">
        <div>
          <h2 className="text-foreground text-center text-2xl font-bold tracking-tight">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Please enter the admin password to view this page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-border bg-background text-foreground w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
                disabled={loading}
              />
              {error && (
                <p className="text-destructive mt-2 text-sm font-medium">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !password}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
