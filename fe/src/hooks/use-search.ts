// src/lib/hooks/use-search.ts
import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { searchStories } from "@/lib/api/comic/search";
import { StoryObject } from "@/lib/api/comic/types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StoryObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    let isCanceled = false;
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchStories(debouncedQuery);
        if (isCanceled) return;
        if (response.success && Array.isArray(response.data?.data?.stories)) {
          setResults(response.data.data.stories);
        } else {
          setResults([]);
          setError("Không tìm thấy kết quả phù hợp");
        }
      } catch (err) {
        if (isCanceled) return;
        setResults([]);
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        if (!isCanceled) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      isCanceled = true;
    };
  }, [debouncedQuery]);

  return { query, setQuery, results, loading, error };
}