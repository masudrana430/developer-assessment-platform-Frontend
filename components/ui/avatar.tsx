import type { HTMLAttributes, ImgHTMLAttributes } from "react";

export function Avatar({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative flex shrink-0 overflow-hidden rounded-full bg-[var(--muted-bg)] ${className}`}
      {...props}
    />
  );
}

export function AvatarImage({ className = "", alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      className={`absolute inset-0 z-10 h-full w-full object-cover ${className}`}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
}

export function AvatarFallback({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`grid h-full w-full place-items-center text-sm font-semibold text-[var(--muted)] ${className}`}
      {...props}
    />
  );
}
