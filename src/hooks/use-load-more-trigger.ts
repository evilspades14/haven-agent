import { useEffect, useRef, useState } from "react";

export function useLoadMoreTrigger(
  onIntersect: () => void,
  enabled: boolean,
  root?: React.RefObject<HTMLDivElement | null>,
  rootMargin = "0px 0px 600px 0px",
) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  // Keep latest callback without re-creating the observer
  const onIntersectRef = useRef(onIntersect);
  useEffect(() => {
    onIntersectRef.current = onIntersect;
  });

  useEffect(() => {
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current();
      },
      { root: root?.current ?? null, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, enabled, root, rootMargin]);

  return setNode; // pass as ref={sentinelRef}
}
