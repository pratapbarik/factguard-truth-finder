import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, content, sourceUrl } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a misinformation detection AI. Analyze the provided content and return a structured assessment.

You MUST respond by calling the "analyze_misinformation" function tool. Do not return plain text.

Consider these factors:
1. Text Risk: Sensationalist language, ALL CAPS, excessive punctuation, known misinformation phrases
2. Source Credibility: Is the source URL from a reputable domain (.gov, .edu, major news)?
3. Virality Pattern: Does the content use engagement-bait tactics?
4. Media Manipulation: For images/video, likelihood of manipulation

Classifications: "Fake", "Likely Fake", "Unverified", "Likely True", "Verified"
Risk levels: "high" (score >= 60), "medium" (score 35-59), "low" (score < 35)`;

    const userPrompt = `Analyze this ${contentType} content for misinformation:

Content: "${content}"
${sourceUrl ? `Source URL: ${sourceUrl}` : "No source URL provided"}

Provide your analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_misinformation",
              description: "Return structured misinformation analysis results",
              parameters: {
                type: "object",
                properties: {
                  classification: {
                    type: "string",
                    enum: ["Fake", "Likely Fake", "Unverified", "Likely True", "Verified"],
                  },
                  confidenceScore: {
                    type: "number",
                    description: "Confidence in the classification (0-100)",
                  },
                  riskScore: {
                    type: "number",
                    description: "Overall risk score (0-100)",
                  },
                  similarityMatch: {
                    type: "number",
                    description: "Similarity to known misinformation (0-100)",
                  },
                  explanation: {
                    type: "string",
                    description: "Human-readable explanation of why this classification was given",
                  },
                  flaggedPhrases: {
                    type: "array",
                    items: { type: "string" },
                    description: "Suspicious phrases found in the content",
                  },
                  riskLevel: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                  },
                  textRisk: {
                    type: "number",
                    description: "Text manipulation risk (0-100)",
                  },
                  sourceCredibility: {
                    type: "number",
                    description: "Source credibility risk (0-100, higher = less credible)",
                  },
                  viralityPattern: {
                    type: "number",
                    description: "Virality/engagement-bait score (0-100)",
                  },
                  mediaManipulation: {
                    type: "number",
                    description: "Media manipulation likelihood (0-100)",
                  },
                  similarCases: {
                    type: "array",
                    items: { type: "string" },
                    description: "References to similar known misinformation cases",
                  },
                },
                required: [
                  "classification",
                  "confidenceScore",
                  "riskScore",
                  "similarityMatch",
                  "explanation",
                  "flaggedPhrases",
                  "riskLevel",
                  "textRisk",
                  "sourceCredibility",
                  "viralityPattern",
                  "mediaManipulation",
                  "similarCases",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_misinformation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return structured analysis");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    // Build full result
    const result = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      contentType,
      contentPreview: content.slice(0, 200),
      sourceUrl: sourceUrl || undefined,
      ...analysis,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
