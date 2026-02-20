import { cn } from "@/lib/utils";
import type { Classification, RiskLevel } from "@/lib/mockAnalysis";

interface RiskBadgeProps {
  classification?: Classification;
  riskLevel?: RiskLevel;
  score?: number;
  size?: "sm" | "md" | "lg";
}

const classificationStyles: Record<Classification, string> = {
  "Fake": "bg-destructive/20 text-destructive border-destructive/40 glow-danger",
  "Likely Fake": "bg-destructive/10 text-destructive border-destructive/30",
  "Unverified": "bg-warning/20 text-warning border-warning/40 glow-warning",
  "Likely True": "bg-primary/10 text-primary border-primary/30",
  "Verified": "bg-primary/20 text-primary border-primary/40 glow-primary",
};

const riskLevelStyles: Record<RiskLevel, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/40",
  medium: "bg-warning/20 text-warning border-warning/40",
  low: "bg-primary/20 text-primary border-primary/40",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export function RiskBadge({ classification, riskLevel, score, size = "md" }: RiskBadgeProps) {
  const style = classification
    ? classificationStyles[classification]
    : riskLevel
    ? riskLevelStyles[riskLevel]
    : "";

  const label = classification || (riskLevel ? `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk` : "");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-display font-medium tracking-wide",
        style,
        sizeStyles[size]
      )}
    >
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        classification === "Fake" || classification === "Likely Fake" || riskLevel === "high" ? "bg-destructive animate-pulse-glow" : "",
        classification === "Unverified" || riskLevel === "medium" ? "bg-warning" : "",
        classification === "Likely True" || classification === "Verified" || riskLevel === "low" ? "bg-primary" : "",
      )} />
      {label}
      {score !== undefined && <span className="opacity-70">({score}%)</span>}
    </span>
  );
}
