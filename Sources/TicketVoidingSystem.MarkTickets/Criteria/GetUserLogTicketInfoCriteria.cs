namespace TicketVoidingSystem.MarkTickets.Criteria
{
    using Fanex.Data.Repository;

    public class GetUserLogTicketInfoCriteria : CriteriaBase
    {
        public string TransIdsXml { get; set; }

        public override string GetSettingKey() => "NAP_SpecialDelete_UserLog_TicketInfo_Select";

        public override bool IsValid() => true;
    }
}