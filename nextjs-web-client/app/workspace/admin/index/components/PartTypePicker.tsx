"use client";

import { Checkbox, Select } from "antd";

import { PartType } from "@/app/types";
import {
  composePartType,
  getPartTypeCategory,
  getPartTypeKind,
  PART_TYPE_CATEGORIES,
  type PartTypeKind,
} from "@/app/types/part/PartTypeLabels";

type Props = {
  value?: PartType;
  onChange?: (value: PartType | undefined) => void;
  disabled?: boolean;
};

export default function PartTypePicker({ value, onChange, disabled }: Props) {
  const selectedCategory = getPartTypeCategory(value);

  return (
    <Select
      allowClear
      disabled={disabled}
      placeholder="Chọn loại gia công"
      style={{ width: "100%" }}
      value={selectedCategory?.newType}
      options={PART_TYPE_CATEGORIES.map((category) => ({
        label: category.label,
        value: category.newType,
      }))}
      onChange={(categoryType: PartType | undefined) => {
        if (categoryType == null) {
          onChange?.(undefined);
          return;
        }

        const category = PART_TYPE_CATEGORIES.find(
          (item) => item.newType === categoryType,
        );
        if (!category) return;

        onChange?.(
          category.hasNR
            ? composePartType(category, "NEW")
            : category.newType,
        );
      }}
    />
  );
}

export function PartTypeKindPicker({
  value,
  onChange,
  disabled,
}: Props) {
  const category = getPartTypeCategory(value);
  if (!category?.hasNR) return null;

  const selectedKind = getPartTypeKind(value);
  const handleSelect = (kind: PartTypeKind, checked: boolean) => {
    if (!checked || disabled) return;
    onChange?.(composePartType(category, kind));
  };

  return (
    <div className="d-flex align-items-center gap-3">
      {(["NEW", "REPAIR"] as const).map((kind) => (
        <Checkbox
          key={kind}
          disabled={disabled}
          checked={selectedKind === kind}
          onChange={(event) => handleSelect(kind, event.target.checked)}
        >
          {kind}
        </Checkbox>
      ))}
    </div>
  );
}
