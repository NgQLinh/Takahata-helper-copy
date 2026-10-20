import { PartType } from "./PartType";

export type PartTypeKind = "NEW" | "REPAIR";

export type PartTypeCategoryOption = {
  label: string;
  hasNR: boolean;
  newType: PartType;
  repairType?: PartType;
};

export const PART_TYPE_CATEGORIES: PartTypeCategoryOption[] = [
  {
    label: "NEW MOLD",
    hasNR: true,
    newType: PartType.NewMold,
    repairType: PartType.NewMoldRepair,
  },
  {
    label: "NEW MOLD REPAIR",
    hasNR: true,
    newType: PartType.NewMoldRepairMakeNew,
    repairType: PartType.NewMoldRepairMakeNewRepair,
  },
  {
    label: "MOLD ECN",
    hasNR: true,
    newType: PartType.MoldEcn,
    repairType: PartType.MoldEcnRepair,
  },
  {
    label: "MOLD MP",
    hasNR: true,
    newType: PartType.MoldMp,
    repairType: PartType.MoldMpRepair,
  },
  {
    label: "MOLD OVERSHORT",
    hasNR: true,
    newType: PartType.MoldOvershort,
    repairType: PartType.MoldOvershortRepair,
  },
  {
    label: "JIG / MOLD / ASSEMBLY / ENGINEERING",
    hasNR: true,
    newType: PartType.JigMoldAssyEng,
    repairType: PartType.JigMoldAssyEngRepair,
  },
];

const REPAIR_TYPES = new Set<PartType>(
  PART_TYPE_CATEGORIES.filter((item) => item.repairType != null).map(
    (item) => item.repairType!,
  ),
);

export function getPartTypeCategory(
  partType?: PartType | null,
): PartTypeCategoryOption | undefined {
  if (partType == null) return undefined;

  return PART_TYPE_CATEGORIES.find(
    (item) => item.newType === partType || item.repairType === partType,
  );
}

export function getPartTypeKind(
  partType?: PartType | null,
): PartTypeKind | null {
  if (partType == null) return null;

  return REPAIR_TYPES.has(partType) ? "REPAIR" : "NEW";
}

export function composePartType(
  category: PartTypeCategoryOption,
  kind: PartTypeKind,
): PartType {
  if (!category.hasNR || category.repairType == null) {
    return category.newType;
  }

  return kind === "REPAIR" ? category.repairType! : category.newType;
}

export function getPartTypeLabel(partType?: PartType | null): string {
  const category = getPartTypeCategory(partType);

  if (!category) return "-";

  const kind = getPartTypeKind(partType);

  if (!kind || !category.hasNR) {
    return category.label;
  }

  return `${category.label} (${kind})`;
}

export const PartTypeLabels: Record<PartType, string> = {
  [PartType.NewMold]: getPartTypeLabel(PartType.NewMold),
  [PartType.NewMoldRepairMakeNew]: getPartTypeLabel(
    PartType.NewMoldRepairMakeNew,
  ),
  [PartType.MoldEcn]: getPartTypeLabel(PartType.MoldEcn),
  [PartType.MoldMp]: getPartTypeLabel(PartType.MoldMp),
  [PartType.MoldOvershort]: getPartTypeLabel(PartType.MoldOvershort),
  [PartType.JigMoldAssyEng]: getPartTypeLabel(PartType.JigMoldAssyEng),
  [PartType.NewMoldRepairMakeNewRepair]: getPartTypeLabel(
    PartType.NewMoldRepairMakeNewRepair,
  ),
  [PartType.MoldEcnRepair]: getPartTypeLabel(PartType.MoldEcnRepair),
  [PartType.MoldMpRepair]: getPartTypeLabel(PartType.MoldMpRepair),
  [PartType.MoldOvershortRepair]: getPartTypeLabel(
    PartType.MoldOvershortRepair,
  ),
  [PartType.JigMoldAssyEngRepair]: getPartTypeLabel(
    PartType.JigMoldAssyEngRepair,
  ),
  [PartType.NewMoldRepair]: getPartTypeLabel(PartType.NewMoldRepair),
};
