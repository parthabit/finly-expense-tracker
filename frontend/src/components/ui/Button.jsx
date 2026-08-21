import clsx from "clsx";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-600 shadow-glow",
  secondary: "bg-secondary-900 text-white hover:bg-secondary-800 dark:bg-white dark:text-secondary-900",
  outline: "border border-secondary-200 dark:border-white/15 text-secondary-700 dark:text-white hover:bg-secondary-50 dark:hover:bg-white/5",
  ghost: "text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-white/5",
  danger: "bg-danger text-white hover:bg-red-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  isLoading,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
        "active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </button>
  );
}
