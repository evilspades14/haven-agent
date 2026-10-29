import { useInView } from "motion/react";
import { useEffect, useRef } from "react";

export function useLoadMoreTrigger(
  onIntersect: () => void,
  enabled: boolean,
  root?: React.RefObject<HTMLDivElement | null>,
) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { root, margin: "0px 0px 500px 0px" });

  useEffect(() => {
    if (isInView && enabled) onIntersect();
  }, [isInView, enabled, onIntersect]);
  return ref;
}