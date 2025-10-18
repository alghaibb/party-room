import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-6 md:p-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/logo.png"
              alt="Party Room Logo"
              width={120}
              height={120}
              priority
              className="dark:invert"
            />
          </Link>
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
