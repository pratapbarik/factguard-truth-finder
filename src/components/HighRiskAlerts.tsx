import { AlertTriangle } from "lucide-react";
import { RiskBadge } from "./RiskBadge";
import type { AnalysisResult } from "@/lib/mockAnalysis";

interface HighRiskAlertsProps {
  submissions: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
}

export function HighRiskAlerts({ submissions, onSelect }: HighRiskAlertsProps) {
  const highRisk = submissions.filter(s => s.riskLevel === "high");

  return (
    <div className="rounded-lg border border-destructive/30 bg-card">
      <div className="flex items-center gap-2 border-b border-destructive/20 p-4">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-destructive">
          High Risk Alerts
        </h3>
        {highRisk.length > 0 && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive">
            {highRisk.length}
          </span>
        )}
      </div>
      <div className="divide-y divide-border">
        {highRisk.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No high-risk content detected
          </div>
        )}
        {highRisk.slice(0, 5).map(alert => (
          <button
            key={alert.id}
            onClick={() => onSelect(alert)}
            className="w-full p-4 text-left transition-colors hover:bg-destructive/5"
          >
            <p className="truncate text-sm text-foreground">{alert.contentPreview}</p>
            <div className="mt-2 flex items-center gap-2">
              <RiskBadge classification={alert.classification} size="sm" />
              <span className="text-xs text-muted-foreground">
                Score: {alert.riskScore}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
