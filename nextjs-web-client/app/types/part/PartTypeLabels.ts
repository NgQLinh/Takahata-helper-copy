import { PartType } from "./PartType";

export const PartTypeLabels: Record<PartType, string> = {
  [PartType.NewMold]: "New mold - Khuôn mới",
  [PartType.NewMoldRepairMakeNew]: "New mold repair / make new",
  [PartType.MoldEcn]: "Mold ECN",
  [PartType.MoldMp]: "Mold MP",
  [PartType.MoldOvershort]: "Mold Overshort",
  [PartType.JigMoldAssyEng]: "Jig / Mold / Assembly / Engineering",
};
