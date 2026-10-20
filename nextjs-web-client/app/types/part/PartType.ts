export enum PartType {
  /**
   * New mold - Khuôn mới
   */
  NewMold = 1,

  /**
   * New mold repair / make new
   * Sửa chữa khuôn mới hoặc làm mới
   */
  NewMoldRepairMakeNew = 2,

  /**
   * Mold ECN - Thay đổi thiết kế/kỹ thuật khuôn
   */
  MoldEcn = 3,

  /**
   * Mold MP - Khuôn phục vụ Mass Production
   */
  MoldMp = 4,

  /**
   * Mold Overshort
   */
  MoldOvershort = 5,

  /**
   * Jig / Mold / Assembly / Engineering
   */
  JigMoldAssyEng = 6,
}
