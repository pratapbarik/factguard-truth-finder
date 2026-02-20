import { useState } from "react";
import { Shield, Upload, Link, FileText, Image, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { analyzeContent, type ContentType, type AnalysisResult } from "@/lib/mockAnalysis";

interface ContentSubmitFormProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const contentTypes: { value: ContentType; label: string; icon: React.ElementType }[] = [
  { value: "text", label: "Text", icon: FileText },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
];

export function ContentSubmitForm({ onAnalysisComplete }: ContentSubmitFormProps) {
  const [contentType, setContentType] = useState<ContentType>("text");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleSubmit = async () => {
    if (!content && !fileName) return;
    setIsAnalyzing(true);
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));
    const result = analyzeContent(contentType, content || fileName, sourceUrl || undefined);
    setIsAnalyzing(false);
    onAnalysisComplete(result);
    setContent("");
    setSourceUrl("");
    setFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setContent(file.name);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 card-hover">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Analyze Content</h2>
          <p className="text-sm text-muted-foreground">Submit content for misinformation detection</p>
        </div>
      </div>

      {/* Content Type Selector */}
      <div className="mb-4 flex gap-2">
        {contentTypes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => { setContentType(value); setContent(""); setFileName(""); }}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all ${
              contentType === value
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content Input */}
      {contentType === "text" ? (
        <Textarea
          placeholder="Paste the text content you want to analyze for misinformation..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="mb-4 min-h-[120px] resize-none bg-secondary border-border font-body text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
        />
      ) : (
        <label className="mb-4 flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary/50 p-8 transition-colors hover:border-primary/40 hover:bg-secondary">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {fileName || `Drop or click to upload ${contentType}`}
          </span>
          <input type="file" className="hidden" accept={contentType === "image" ? "image/*" : "video/*"} onChange={handleFileChange} />
        </label>
      )}

      {/* Source URL */}
      <div className="mb-6 flex items-center gap-2">
        <Link className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Source URL (optional)"
          value={sourceUrl}
          onChange={e => setSourceUrl(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isAnalyzing || (!content && !fileName)}
        className="w-full bg-primary text-primary-foreground font-display font-semibold tracking-wide hover:bg-primary/90 disabled:opacity-40"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Run Analysis
          </>
        )}
      </Button>
    </div>
  );
}
