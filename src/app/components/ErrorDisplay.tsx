interface ErrorDisplayProps {
  title?: string;
  message: string;
}

export default function ErrorDisplay({
  title = 'Stats unavailable',
  message,
}: ErrorDisplayProps) {
  return (
    <section
      role="alert"
      aria-live="polite"
      className="dashboard-alert dashboard-frame alert rounded-2xl px-4 py-4"
    >
      <div className="flex items-start gap-3">
        <span className="dashboard-ember mt-1 h-2.5 w-2.5 rounded-full" aria-hidden="true"></span>
        <div className="space-y-1">
          <h2 className="dashboard-heading text-base font-semibold">{title}</h2>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </section>
  );
}
