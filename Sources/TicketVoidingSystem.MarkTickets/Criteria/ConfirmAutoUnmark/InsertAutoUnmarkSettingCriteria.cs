using Fanex.Data.Repository;

namespace TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark
{
    public class InsertAutoUnmarkSettingCriteria : NonQueryCommand
    {
        public int MatchId { get; set; }
        public int Bettype { get; set; }
        public int MarkedBy { get; set; }
        public long? BetId { get; set; }
        public int UserId { get; set; }

        public override string GetSettingKey() => "TicketVoiding_AutoUnmarkSetting_Insert";

        public override bool IsValid() => true;
    }
}