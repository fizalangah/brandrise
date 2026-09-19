"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function ForgotPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [resetKey, setResetKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password at least 8 characters long hona chahiye.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, reset_key: resetKey, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Reset failed");
        return;
      }
      setMessage(data.message || "Password reset. Now login.");
      setTimeout(() => router.push("/login"), 1500);
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
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Forgot your admin password? Reset it with your secret key.
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
              label="Secret Reset Key"
              hint="(BRANDRISE_RESET_KEY env)"
              placeholder="••••••••••••"
              required
              value={resetKey}
              onChange={(e) => setResetKey(e.target.value)}
            />
          </div>
          <div>
            <PasswordInput
              label="New Password (min 8)"
              placeholder="••••••••"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <PasswordInput
              label="Confirm New Password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <a
            href="/login"
            className="text-xs font-medium text-violet-600 transition hover:text-violet-700 hover:underline"
          >
            Back to login
          </a>
        </p>
      </div>
    </main>
  );
}