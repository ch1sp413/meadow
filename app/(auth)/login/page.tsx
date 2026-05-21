import { Leaf, Mail, ShieldCheck } from "lucide-react";
import { sendMagicLink, signIn } from "@/app/app/actions/auth";

export default function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  return (
    <LoginContent searchParams={searchParams} />
  );
}

async function LoginContent({
  searchParams
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative flex min-h-[42vh] items-end overflow-hidden bg-meadow-bark px-6 py-10 text-white lg:min-h-screen lg:px-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-meadow-bark via-meadow-bark/55 to-transparent" />
        <div className="relative max-w-2xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-white/15 backdrop-blur">
            <Leaf className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-5xl font-bold tracking-normal md:text-6xl">Meadow</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/82">
            Whole-sanctuary operations for animal care, people, supplies, transport, compliance, and giving.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-md border border-stone-200 bg-white/90 p-6 shadow-soft">
          <div className="mb-6">
            <p className="label mb-2">Invite-only access</p>
            <h2 className="text-2xl font-bold text-meadow-bark">Sign in to your sanctuary</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Use your Meadow account or request a magic link for passwordless access.
            </p>
          </div>

          {params.error ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}
          {params.sent ? (
            <div className="mb-4 rounded-md border border-meadow-leaf/40 bg-meadow-leaf/15 px-3 py-2 text-sm text-meadow-bark">
              Check your email for a secure sign-in link.
            </div>
          ) : null}

          <form action={signIn} className="grid gap-4">
            <label className="grid gap-1">
              <span className="label">Email</span>
              <input className="field" name="email" type="email" autoComplete="email" required />
            </label>
            <label className="grid gap-1">
              <span className="label">Password</span>
              <input className="field" name="password" type="password" autoComplete="current-password" required />
            </label>
            <button className="button-primary" type="submit">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Sign in
            </button>
          </form>

          <form action={sendMagicLink} className="mt-3 grid gap-3">
            <input className="field" name="email" type="email" placeholder="email@sanctuary.org" required />
            <button className="button-secondary" type="submit">
              <Mail className="h-4 w-4" aria-hidden />
              Send magic link
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
