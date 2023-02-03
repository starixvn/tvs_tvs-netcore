using Fanex.Data.Repository;

namespace TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark
{
    public class GetTicketsAbnormalBetCriteria : CriteriaBase
    {
        public int MatchId { get; set; }

        public override string GetSettingKey() => "TicketVoiding_AutoUnmark_Ticket_Select";

        public override bool IsValid() => true;
    }
}