import { pb } from "@/lib/pocketbase";
import { Match } from "@/lib/match-types";

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL;

export async function fetchMatches(): Promise<Match[]> {
  const records = await pb.collection("matches").getFullList<Match>({
    sort: "-match_date,-created",
  });
  return records;
}

export async function fetchMatch(id: string): Promise<Match | null> {
  try {
    const record = await pb.collection("matches").getOne<Match>(id);
    return record;
  } catch {
    return null;
  }
}

export async function insertMatch(match: Omit<Match, "id" | "created" | "updated" | "collectionId" | "collectionName">): Promise<Match> {
  const record = await pb.collection("matches").create<Match>(match);
  return record;
}

export async function parseMatchStats(imageBase64: string): Promise<Record<string, any>> {
  const response = await fetch(`${FUNCTIONS_URL}/parse-match-stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}
