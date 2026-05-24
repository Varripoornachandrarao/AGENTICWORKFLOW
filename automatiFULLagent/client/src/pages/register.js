import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Workflow } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      router.replace("/dashboard");
    } catch {
      // The auth store exposes the display-ready error message.
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-panel px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-sm">
        <div className="mb-7">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white">
            <Workflow size={21} />
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-ink">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Start building agentic automations.</p>
        </div>

        {error ? <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <label className="block text-sm font-medium text-ink" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          required
          minLength={2}
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
        />

        <label className="mt-4 block text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
        />

        <label className="mt-4 block text-sm font-medium text-ink" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-accent">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
