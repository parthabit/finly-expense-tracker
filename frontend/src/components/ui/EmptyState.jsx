export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary mb-4">
          <Icon size={26} />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
