using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;

public class UpdateConfirmAutoUnmarkCriteria : NonQueryCommand
{
    public int MatchId { get; set; }

    public string TransIds { get; set; }

    public int Bettype { get; set; }

    public int MarkedBy { get; set; }

    public long? BetId { get; set; }

    public int UserId { get; set; }

    public string IP { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_AutoUnmark_Update");

    public override bool IsValid() => true;
}