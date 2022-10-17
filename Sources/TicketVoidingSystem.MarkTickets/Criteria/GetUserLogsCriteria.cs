namespace TicketVoidingSystem.MarkTickets.Criteria
{
    using System;
    using Fanex.Data.Repository;

    public class GetUserLogsCriteria : CriteriaBase
    {
        public DateTime? LogDateFrom { get; set; }

        public DateTime? LogDateTo { get; set; }

        public int? MatchId { get; set; }

        public string LogActionIds { get; set; }

        public string DoneBy { get; set; }

        public override string GetSettingKey() => "Nap_SpecialDelete_UserLog_MarkTickets_Select";

        public override bool IsValid() => true;
    }
}