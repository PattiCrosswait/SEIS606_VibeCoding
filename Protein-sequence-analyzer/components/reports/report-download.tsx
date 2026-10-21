import { Button } from "@/components/ui/button";

export function ReportDownload({ report, filename = "protein-analysis-report.txt" }: { report: string; filename?: string }) {
  function download() {
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  return <Button type="button" onClick={download}>Download report</Button>;
}
