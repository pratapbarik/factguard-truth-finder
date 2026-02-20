import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { AnalysisResult } from "@/lib/mockAnalysis";

interface RiskDistributionChartProps {
  submissions: AnalysisResult[];
}

const RISK_COLORS: Record<string, string> = {
  "Verified": "hsl(160, 84%, 45%)",
  "Likely True": "hsl(160, 60%, 55%)",
  "Unverified": "hsl(38, 92%, 55%)",
  "Likely Fake": "hsl(0, 60%, 60%)",
  "Fake": "hsl(0, 72%, 55%)",
};

export function RiskDistributionChart({ submissions }: RiskDistributionChartProps) {
  const distribution = Object.entries(
    submissions.reduce((acc, s) => {
      acc[s.classification] = (acc[s.classification] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  if (distribution.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Risk Distribution
        </h3>
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No data to display
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Risk Distribution
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={distribution}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {distribution.map(entry => (
              <Cell key={entry.name} fill={RISK_COLORS[entry.name] || "#666"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 9%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 92%)",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
