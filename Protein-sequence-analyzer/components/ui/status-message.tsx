interface StatusMessageProps {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
}

export function StatusMessage({ tone = "info", children }: StatusMessageProps) {
  return <div className={`status ${tone === "error" ? "error" : tone === "success" ? "success" : ""}`} role="status" aria-live="polite">{children}</div>;
}
