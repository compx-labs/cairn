// app/components/Skeleton.tsx
import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-ink-200 dark:bg-dark-border rounded",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-line dark:border-dark-border p-6 shadow-sm transition-colors duration-200">
      {children}
    </div>
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={clsx("h-4", className)} />;
}

export function SkeletonTitle({ className }: { className?: string }) {
  return <Skeleton className={clsx("h-6", className)} />;
}
