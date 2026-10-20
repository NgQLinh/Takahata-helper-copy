namespace TAKAHATA.Domain.Common.Enum
{
    public enum PartType
    {
        /// <summary>
        /// New mold - Khuôn mới
        /// </summary>
        NewMold = 1,

        /// <summary>
        /// New mold repair / make new
        /// Sửa chữa khuôn mới hoặc làm mới
        /// </summary>
        NewMoldRepairMakeNew = 2,

        /// <summary>
        /// Mold ECN - Thay đổi thiết kế/kỹ thuật khuôn
        /// </summary>
        MoldEcn = 3,

        /// <summary>
        /// Mold MP - Khuôn phục vụ Mass Production
        /// </summary>
        MoldMp = 4,

        /// <summary>
        /// Mold Overshort
        /// </summary>
        MoldOvershort = 5,

        /// <summary>
        /// Jig / Mold / Assembly / Engineering
        /// </summary>
        JigMoldAssyEng = 6
    }
}
