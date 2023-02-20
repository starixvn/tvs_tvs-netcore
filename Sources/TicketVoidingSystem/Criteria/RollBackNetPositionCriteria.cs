using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria;

public class RollBackNetPositionCriteria : NonQueryCommand
{
    public string CricketIds { get; set; }

    public string Action { get; set; }

    public int AdminId { get; set; }

    public string Reason { get; set; }

    public override string GetSettingKey() => "NAP_RollbackCricketList";

    public override bool IsValid() => true;
}