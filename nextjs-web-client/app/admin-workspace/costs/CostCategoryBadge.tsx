import { CostCategory } from "./cost-data";

type Props = {
  category: CostCategory;
};

const categoryClass: Record<CostCategory, string> = {
  MATERIAL: "bg-blue-100 text-blue-700",
  MACHINE: "bg-green-100 text-green-700",
  LABOR: "bg-yellow-100 text-yellow-700",
  OUTSOURCE: "bg-purple-100 text-purple-700",
  REPAIR: "bg-red-100 text-red-700",
  MODIFY: "bg-orange-100 text-orange-700",
  TRY_OUT: "bg-gray-100 text-gray-700",
};

export function CostCategoryBadge({ category }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${categoryClass[category]}`}
    >
      {category}
    </span>
  );
}