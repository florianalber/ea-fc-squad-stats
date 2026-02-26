import { supabase } from "@/integrations/supabase/client";
import { Match } from "@/lib/match-types";

export async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchMatch(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function insertMatch(match: Omit<Match, "id" | "created_at">): Promise<Match> {
  const { data, error } = await supabase
    .from("matches")
    .insert(match)
    .select()
    .single();

  if (error) throw error;
  return data;
}
