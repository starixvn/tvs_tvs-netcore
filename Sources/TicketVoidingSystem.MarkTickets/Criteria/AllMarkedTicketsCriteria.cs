namespace TicketVoidingSystem.MarkTickets.Criteria
{
    public class AllMarkedTicketsCriteria : CriteriaBase
    {
        public int MarkedBy { get; set; }

        [SpParam(Ignored = true)]
        public int SiteDbGroupId { get; set; }

        public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "Nap_SpecialDelete_AllMarkedTicketsSummary_Select");

        public override bool IsValid() => true;
    }
}