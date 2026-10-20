import { PartType } from "./PartType";

export const PartTypeLabels: Record<PartType, string> = {
  [PartType.NewMold]: "NEW MOLD",
  [PartType.NewMoldRepairMakeNew]: "NEW MOLD REPAIR / MAKE NEW",
  [PartType.MoldEcn]: "MOLD ECN",
  [PartType.MoldMp]: "MOLD MP",
  [PartType.MoldOvershort]: "MOLD OVERSHORT",
  [PartType.JigMoldAssyEng]: "JIG / MOLD / ASSEMBLY / ENGINEERING",
};
