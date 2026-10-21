import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function SequenceInput({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
  return <div className="input-body"><Textarea value={value} onChange={(event) => onChange(event.target.value)} aria-label="Protein sequence input" spellCheck={false} /><div className="button-row input-actions"><Button type="button" variant="primary" onClick={onSubmit}>Analyze sequence</Button></div></div>;
}
