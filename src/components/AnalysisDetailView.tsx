import { ArrowLeft, AlertTriangle, CheckCircle, Info, ExternalLink } from "lucide-react";
import { RiskBadge } from "./RiskBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { AnalysisResult } from "@/lib/mockAnalysis";

interface AnalysisDetailViewProps {
  result: AnalysisResult;
  onBack: () => void;
}

export function AnalysisDetailView({ result, onBack }: AnalysisDetailViewProps) {
  const riskFactors = [
    { label: "Text Risk", value: result.textRisk, weight: "50%" },
    { label: "Source Credibility", value: result.sourceCredibility, weight: "20%" },
    { label: "Virality Pattern", value: result.viralityPattern, weight: "20%" },
    { label: "Media Manipulation", value: result.mediaManipulation, weight: "10%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <span className="text-sm text-muted-foreground">Analysis Detail</span>
      </div>

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <RiskBadge classification={result.classification} score={result.confidenceScore} size="lg" />
            <p className="mt-3 text-sm text-muted-foreground">
              Analyzed {new Date(result.timestamp).toLocaleString()} · {result.contentType.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-foreground">{result.riskScore}%</p>
            <p className="text-sm text-muted-foreground">Overall Risk Score</p>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Content Preview
        </h3>
        <p className="text-sm leading-relaxed text-foreground">
          {result.contentPreview}
        </p>
        {result.sourceUrl && (
          <a
            href={result.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {result.sourceUrl}
          </a>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Breakdown */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Risk Breakdown
          </h3>
          <div className="space-y-4">
            {riskFactors.map(factor => (
              <div key={factor.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-foreground">{factor.label}</span>
                  <span className="font-display text-muted-foreground">
                    {factor.value}% <span className="text-xs opacity-60">(×{factor.weight})</span>
                  </span>
                </div>
                <Progress
                  value={factor.value}
                  className="h-2 bg-secondary"
                  indicatorClassName={
                    factor.value >= 60 ? "bg-destructive" : factor.value >= 35 ? "bg-warning" : "bg-primary"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Explainability */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Why This Was Flagged
          </h3>
          <div className="mb-4 flex items-start gap-2 rounded-md bg-secondary p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground">{result.explanation}</p>
          </div>

          {result.flaggedPhrases.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Flagged Phrases
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.flaggedPhrases.map(phrase => (
                  <span
                    key={phrase}
                    className="rounded bg-destructive/10 px-2 py-0.5 font-display text-xs text-destructive border border-destructive/20"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Similar Cases
            </p>
            <ul className="space-y-1.5">
              {result.similarCases.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Similarity */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Similarity Match
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Compared against known misinformation database
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-foreground">{result.similarityMatch}%</p>
            <p className="text-xs text-muted-foreground">match found</p>
          </div>
        </div>
      </div>
    </div>
  );
}
