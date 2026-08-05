import { Purity } from "@/types/core/Purity";
import { Badge } from "./ui/badge";

const PurityBadge = ({ purity }: { purity: Purity }) => {
  if (purity === "sfw") {
    return <Badge>{purity.toUpperCase()}</Badge>;
  }
};

export default PurityBadge;