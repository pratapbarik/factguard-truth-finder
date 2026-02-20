import { useState, useMemo } from "react";
import { Shield, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ContentSubmitForm } from "@/components/ContentSubmitForm";
import { RecentSubmissions } from "@/components/RecentSubmissions";
import { RiskDistributionChart } from "@/components/RiskDistributionChart";
import { HighRiskAlerts } from "@/components/HighRiskAlerts";
import { StatsBar } from "@/components/StatsBar";
import { AnalysisDetailView } from "@/components/AnalysisDetailView";
import { generateSampleData, type AnalysisResult } from "@/lib/mockAnalysis";

const Index = () => {
  const [submissions, setSubmissions] = useState<AnalysisResult[]>(() => generateSampleData());
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery) return submissions;
    const q = searchQuery.toLowerCase();
    return submissions.filter(
      s =>
        s.contentPreview.toLowerCase().includes(q) ||
        s.classification.toLowerCase().includes(q) ||
        s.contentType.includes(q)
    );
  }, [submissions, searchQuery]);

  const handleNewAnalysis = (result: AnalysisResult) => {
    setSubmissions(prev => [result, ...prev]);
    setSelectedResult(result);
  };

  if (selectedResult) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto flex items-center gap-3 px-4 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
              TruthGuard
            </h1>
            <span className="rounded bg-primary/10 px-2 py-0.5 font-display text-xs text-primary border border-primary/20">
              v1.0
            </span>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <AnalysisDetailView result={selectedResult} onBack={() => setSelectedResult(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
                TruthGuard
              </h1>
              <p className="text-xs text-muted-foreground">Misinformation Detection Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64 bg-secondary border-border pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsBar submissions={submissions} />

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            <ContentSubmitForm onAnalysisComplete={handleNewAnalysis} />
            <RecentSubmissions submissions={filtered} onSelect={setSelectedResult} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RiskDistributionChart submissions={submissions} />
            <HighRiskAlerts submissions={submissions} onSelect={setSelectedResult} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
