import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sign-language", label: "Sign" },
  { href: "/morse-code", label: "Morse" },
  { href: "/braille", label: "Braille" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-sm font-bold tracking-[0.24em] uppercase">
          Silentink
        </Link>
        <nav className="flex gap-1 text-xs md:text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border border-transparent px-3 py-1.5 text-muted transition-colors hover:border-border hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
