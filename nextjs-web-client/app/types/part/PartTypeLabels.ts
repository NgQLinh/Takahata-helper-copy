import { PartType } from "./PartType";

export const PartTypeLabels: Record<PartType, string> = {
  [PartType.NewMold]: "KHUÔN MỚI",
  [PartType.NewMoldRepairMakeNew]: "LÀM MỚI, SỬA KHUÔN MỚI SAU T0",
  [PartType.MoldEcn]: "KHUÔN THAY ĐỔI THIẾT KẾ",
  [PartType.MoldMp]: "KHUÔN ĐANG SẢN XUẤT",
  [PartType.MoldOvershort]: "KHUÔN VƯỢT QUÁ SỐ SHORT QUY ĐỊNH",
  [PartType.JigMoldAssyEng]: "ĐỒ GÁ MOLD, ASSY. ENG",
};
