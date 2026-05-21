import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AcceptInvitePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-lg rounded-md border border-stone-200 bg-white/90 p-6 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-meadow-bark text-white">
          <Leaf className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-meadow-bark">Accept your Meadow invite</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Invite links are issued through Supabase email templates. After setting your password or using a magic link,
          Meadow will connect you to the sanctuary membership created by an owner.
        </p>
        <Link className="button-primary mt-5" href="/login">
          Continue to sign in
        </Link>
      </div>
    </main>
  );
}
