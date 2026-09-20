export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}
