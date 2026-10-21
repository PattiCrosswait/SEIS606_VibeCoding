import { Activity, BookOpen, ChartNoAxesCombined, FileText, Settings2 } from "lucide-react";

const NAV = [
  { label: "Analyze", icon: Activity },
  { label: "Saved", icon: BookOpen },
  { label: "Compare", icon: ChartNoAxesCombined },
  { label: "Reports", icon: FileText },
  { label: "Preferences", icon: Settings2 },
];

export function SidebarNav({ active, onChange }: { active: string; onChange: (label: string) => void }) {
  return <aside className="rail" aria-label="Primary navigation">
    <div className="logo"><span className="logo-mark">⌁</span>What&apos;s In My Protein</div>
    <nav className="nav-list">
      {NAV.map(({ label, icon: Icon }) => <button key={label} type="button" className={`nav-button ${active === label ? "active" : ""}`} onClick={() => onChange(label)} aria-current={active === label ? "page" : undefined}><Icon size={17} aria-hidden="true" /><span className="nav-label">{label}</span></button>)}
    </nav>
  </aside>;
}
