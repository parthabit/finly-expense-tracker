import clsx from "clsx";

export function Skeleton({ className }) {
  return <div className={clsx("skeleton rounded-lg", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-secondary-900 shadow-card border border-secondary-100 dark:border-white/5 p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
