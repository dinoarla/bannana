"use client";

import { useEffect, useState } from "react";

export default function useSWRLike<T>(url: string | null) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.success) throw new Error(json.error.message);
        setData(json.data);
      })
      .catch((err) => !cancelled && setError(err));
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, error, isLoading: !data && !error };
}
