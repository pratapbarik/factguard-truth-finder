import { FileText, Image, Video, ChevronRight } from "lucide-react";
import { RiskBadge } from "./RiskBadge";
import type { AnalysisResult, ContentType } from "@/lib/mockAnalysis";

interface RecentSubmissionsProps {
  submissions: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
}

const typeIcons: Record<ContentType, React.ElementType> = {
  text: FileText,
  image: Image,
  video: Video,
};

export function RecentSubmissions({ submissions, onSelect }: RecentSubmissionsProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Submissions
        </h3>
      </div>
      <div className="divide-y divide-border">
        {submissions.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No submissions yet. Analyze content to get started.
          </div>
        )}
        {submissions.map(sub => {
          const Icon = typeIcons[sub.contentType];
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{sub.contentPreview}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(sub.timestamp).toLocaleString()}
                </p>
              </div>
              <RiskBadge classification={sub.classification} size="sm" />
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
