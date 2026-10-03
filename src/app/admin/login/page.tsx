"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { login, setToken, setStoredUser, isAuthenticated, AdminApiError } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email.trim(), password);
      setToken(response.token);
      setStoredUser({
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
      });
      router.replace("/admin");
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0b24] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl">
            🏡
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            BookFarm<span className="text-violet-600">Villa</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Admin Panel Login</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bookfarmvilla.com"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 text-sm outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((currentValue) => !currentValue)
                }
                className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition-colors hover:text-violet-600 focus:outline-none focus-visible:text-violet-600"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
      
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
