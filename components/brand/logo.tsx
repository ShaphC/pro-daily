import Link from "next/link";

type LogoProps = {
  href?: string;
  showWordmark?: boolean;
  className?: string;
};

export function Logo({
  href = "/",
  showWordmark = true,
  className = "",
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-[3px] rounded-[9px] bg-gradient-to-br from-black/[0.08] to-transparent dark:from-white/[0.08]" />
        <span className="relative text-[11px] font-bold tracking-[-0.08em] text-stone-950 dark:text-white">
          CM
        </span>
      </div>

      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-[-0.025em] text-stone-950 dark:text-white">
          Checkmarkr
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="Checkmarkr">
      {content}
    </Link>
  );
}
