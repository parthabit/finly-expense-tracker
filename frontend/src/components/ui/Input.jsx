import { forwardRef } from "react";

const Input = forwardRef(({ label, error, icon: Icon, type = "text", ...props }, ref) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />}
        <input
          ref={ref}
          type={type}
          className={`w-full rounded-xl border bg-white dark:bg-secondary-900 px-3.5 py-2.5 text-sm outline-none transition
            ${Icon ? "pl-10" : ""}
            ${error ? "border-danger focus:ring-2 focus:ring-red-100" : "border-secondary-200 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
