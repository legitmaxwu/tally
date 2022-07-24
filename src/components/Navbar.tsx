import { useRouter } from "next/router";

export function Navbar() {
  const router = useRouter();
  return (
    <nav className="w-full flex items-center gap-4 justify-between py-3">
      <button
        onClick={() => router.push("/")}
        className="font-semibold text-xl tracking-tight hover:text-slate-700 transition"
      >
        Tally
      </button>

      <span className="font-light text-sm tracking-tight">
        Anonymously vote on stuff.
      </span>
    </nav>
  );
}
