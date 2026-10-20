namespace TAKAHATA.Domain.Common.Enum
{
    public static class PartTypeFormatter
    {
        public static string ToClassificationName(PartType partType)
        {
            return partType switch
            {
                PartType.NewMold or PartType.NewMoldRepair => "NEW MOLD",
                PartType.NewMoldRepairMakeNew or PartType.NewMoldRepairMakeNewRepair
                    => "NEW MOLD REPAIR",
                PartType.MoldEcn or PartType.MoldEcnRepair => "MOLD ECN",
                PartType.MoldMp or PartType.MoldMpRepair => "MOLD MP",
                PartType.MoldOvershort or PartType.MoldOvershortRepair
                    => "MOLD OVERSHORT",
                PartType.JigMoldAssyEng or PartType.JigMoldAssyEngRepair
                    => "JIG / MOLD / ASSEMBLY / ENGINEERING",
                _ => partType.ToString()
            };
        }

        public static string ToNewRepairName(PartType partType)
        {
            return partType switch
            {
                PartType.NewMoldRepairMakeNewRepair
                    or PartType.MoldEcnRepair
                    or PartType.MoldMpRepair
                    or PartType.MoldOvershortRepair
                    or PartType.JigMoldAssyEngRepair
                    or PartType.NewMoldRepair => "REPAIR",
                _ => "NEW"
            };
        }
    }
}
