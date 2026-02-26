import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Analyze this EA FC match statistics screen image. Extract ALL statistics shown.

Return a JSON object with EXACTLY these keys (use null if a value is not visible):
{
  "home_team_name": "string - left team name",
  "away_team_name": "string - right team name", 
  "home_score": number,
  "away_score": number,
  "minutes_played": number (total minutes played, e.g. 90, 120, 122 - look for the match time/duration on the screen, often shown near the score or at the top),
  "home_possession": number (percentage, e.g. 55),
  "away_possession": number,
  "home_shots": number,
  "away_shots": number,
  "home_xg": number (decimal, e.g. 1.5),
  "away_xg": number,
  "home_shot_accuracy": number (percentage),
  "away_shot_accuracy": number,
  "home_pass_accuracy": number (percentage),
  "away_pass_accuracy": number,
  "home_passes": number,
  "away_passes": number,
  "home_dribble_success": number (percentage),
  "away_dribble_success": number,
  "home_tackles": number,
  "away_tackles": number,
  "home_tackles_won": number,
  "away_tackles_won": number,
  "home_ball_recovery_time": number (seconds, decimal),
  "away_ball_recovery_time": number,
  "home_interceptions": number,
  "away_interceptions": number,
  "home_saves": number,
  "away_saves": number,
  "home_fouls": number,
  "away_fouls": number,
  "home_offsides": number,
  "away_offsides": number,
  "home_corners": number,
  "away_corners": number,
  "home_free_kicks": number,
  "away_free_kicks": number,
  "home_penalties": number,
  "away_penalties": number,
  "home_yellow_cards": number,
  "away_yellow_cards": number
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation. The left side is always home, right side is always away.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: image } },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Extract JSON from response (may be wrapped in ```json blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const stats = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
