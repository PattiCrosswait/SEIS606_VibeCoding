import { Button } from "./button";

export function AsyncState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="async-state" role="status" aria-live="polite"><span>{message}</span>{onRetry ? <Button type="button" onClick={onRetry}>Retry</Button> : null}</div>;
}
