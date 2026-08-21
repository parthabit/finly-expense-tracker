import clsx from "clsx";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white dark:bg-secondary-900 shadow-card border border-secondary-100 dark:border-white/5 p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
