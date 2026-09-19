"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

type Lead = {
  id: string;
  name: string;
  business: string;
  phone: string;
  message: string;
  created_at: number;
};

function formatDate(ms: number) {
  return new Date(ms).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<{ total: number; today: number }>({
    total: 0,
    today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pw, setPw] = useState({ old_password: "", new_password: "" });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("brandrise_token");
    if (!t) {
      router.replace("/login");
      return;
    }
    const id = setTimeout(() => setToken(t), 0);
    return () => clearTimeout(id);
  }, [router]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [leadsRes, statsRes] = await Promise.all([
        fetch("/api/leads", { headers }),
        fetch("/api/leads/stats", { headers }),
      ]);
      if (leadsRes.status === 401 || statsRes.status === 401) {
        localStorage.removeItem("brandrise_token");
        router.replace("/login");
        return;
      }
      if (!leadsRes.ok || !statsRes.ok) throw new Error("Failed");
      setLeads(await leadsRes.json());
      setStats(await statsRes.json());
    } catch {
      setError("API se connection fail hua");
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    if (token) {
      const id = setTimeout(() => load(), 0);
      return () => clearTimeout(id);
    }
  }, [token, load]);

  const logout = () => {
    localStorage.removeItem("brandrise_token");
    router.replace("/login");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPwMsg(null);
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pw),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg({ ok: false, text: data.detail || "Failed" });
        return;
      }
      setPwMsg({ ok: true, text: data.message || "Password updated" });
      setPw({ old_password: "", new_password: "" });
    } catch {
      setPwMsg({ ok: false, text: "API se connection fail hua" });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <main className="min-h-full flex-1 bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
              B
            </span>
            <span className="font-bold text-slate-900">
              Brand<span className="text-violet-600">Rise</span>{" "}
              <span className="text-sm font-medium text-slate-400">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-violet-400 hover:text-violet-600"
            >
              Website
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Website contact form se aane wale enquiries
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-violet-600">{stats.total}</div>
            <div className="mt-1 text-sm text-slate-500">Total Leads</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-600">{stats.today}</div>
            <div className="mt-1 text-sm text-slate-500">Today</div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
          <form onSubmit={changePassword} className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <PasswordInput
              placeholder="Old password"
              required
              value={pw.old_password}
              onChange={(e) => setPw({ ...pw, old_password: e.target.value })}
            />
            <PasswordInput
              placeholder="New password (8+ chars)"
              required
              minLength={8}
              value={pw.new_password}
              onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
            />
            <button
              type="submit"
              disabled={pwLoading}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {pwLoading ? "Saving..." : "Update"}
            </button>
          </form>
          {pwMsg && (
            <p
              className={`mt-3 text-sm font-medium ${
                pwMsg.ok ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {pwMsg.text}
            </p>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              Abhi koi lead nahi — form se pehla lead aane par yahan dikhega.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Business</th>
                    <th className="px-6 py-3 font-semibold">Phone</th>
                    <th className="px-6 py-3 font-semibold">Message</th>
                    <th className="px-6 py-3 font-semibold">When</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4 font-semibold text-slate-900">{l.name}</td>
                      <td className="px-6 py-4 text-slate-700">{l.business}</td>
                      <td className="px-6 py-4 text-slate-700">
                        <a
                          href={`https://wa.me/${l.phone.replace(/^0/, "92")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-emerald-600 hover:underline"
                        >
                          {l.phone}
                        </a>
                      </td>
                      <td className="max-w-[220px] px-6 py-4 text-slate-600">{l.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {formatDate(l.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}