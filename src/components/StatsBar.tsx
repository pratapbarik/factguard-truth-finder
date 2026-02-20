import { Shield, AlertTriangle, Eye, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "@/lib/mockAnalysis";

interface StatsBarProps {
  submissions: AnalysisResult[];
}

export function StatsBar({ submissions }: StatsBarProps) {
  const total = submissions.length;
  const highRisk = submissions.filter(s => s.riskLevel === "high").length;
  const avgRisk = total > 0 ? Math.round(submissions.reduce((a, s) => a + s.riskScore, 0) / total) : 0;
  const verified = submissions.filter(s => s.classification === "Verified" || s.classification === "Likely True").length;

  const stats = [
    { label: "Total Scanned", value: total, icon: Eye, color: "text-primary" },
    { label: "High Risk", value: highRisk, icon: AlertTriangle, color: "text-destructive" },
    { label: "Avg Risk Score", value: `${avgRisk}%`, icon: TrendingUp, color: "text-warning" },
    { label: "Verified", value: verified, icon: Shield, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card p-4 card-hover"
        >
          <div className="flex items-center gap-2">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
