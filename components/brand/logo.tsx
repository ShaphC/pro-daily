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
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
        <span className="text-[10px] font-bold tracking-[-0.08em] text-stone-950 dark:text-white">
          CMkr
        </span>
      </div>

      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-[-0.025em] text-stone-950 dark:text-white">
          CheckMarkr
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="CheckMarkr">
      {content}
    </Link>
  );
}
