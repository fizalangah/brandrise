"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }
      localStorage.setItem("brandrise_token", data.token);
      router.push("/admin");
    } catch {
      setError("Backend se connection fail hua. API chal rahi hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xl font-bold text-white">
            B
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            BrandRise Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Login to view your leads
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/forgot"
            className="text-xs font-medium text-violet-600 transition hover:text-violet-700 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Default: admin / admin123 — production mein change karein.
        </p>
      </div>
    </main>
  );
}