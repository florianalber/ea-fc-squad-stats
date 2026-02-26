import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMatches, fetchMatch, insertMatch } from "@/lib/match-api";

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ["matches", id],
    queryFn: () => fetchMatch(id),
    enabled: !!id,
  });
}

export function useInsertMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (match: Record<string, any>) => insertMatch(match as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
