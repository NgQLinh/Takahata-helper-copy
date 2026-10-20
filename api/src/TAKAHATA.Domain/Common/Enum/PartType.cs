namespace TAKAHATA.Domain.Common.Enum
{
    public enum PartType
    {
        /// <summary>
        /// New mold - Khuôn mới (ô New Model, không dùng N/R)
        /// </summary>
        NewMold = 1,

        /// <summary>
        /// New mold repair — New
        /// </summary>
        NewMoldRepairMakeNew = 2,

        /// <summary>
        /// Mold ECN — New
        /// </summary>
        MoldEcn = 3,

        /// <summary>
        /// Mold MP — New
        /// </summary>
        MoldMp = 4,

        /// <summary>
        /// Mold Overshort — New
        /// </summary>
        MoldOvershort = 5,

        /// <summary>
        /// Jig / Mold / Assembly / Engineering — New
        /// </summary>
        JigMoldAssyEng = 6,

        /// <summary>
        /// New mold repair — Repair
        /// </summary>
        NewMoldRepairMakeNewRepair = 7,

        /// <summary>
        /// Mold ECN — Repair
        /// </summary>
        MoldEcnRepair = 8,

        /// <summary>
        /// Mold MP — Repair
        /// </summary>
        MoldMpRepair = 9,

        /// <summary>
        /// Mold Overshort — Repair
        /// </summary>
        MoldOvershortRepair = 10,

        /// <summary>
        /// Jig / Mold / Assembly / Engineering — Repair
        /// </summary>
        JigMoldAssyEngRepair = 11,

        /// <summary>
        /// New mold — Repair
        /// </summary>
        NewMoldRepair = 12
    }
}
