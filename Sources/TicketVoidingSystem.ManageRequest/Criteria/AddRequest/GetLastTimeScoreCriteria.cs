using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetLastTimeScoreCriteriaBase : OnlineServerCriteriaBase
{
    public int MatchId { get; set; }

    public DateTime FilterFromTransTime { get; set; }

    public int ActionId { get; set; }

    public int FilterBy { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_LastTime_Select");

    public override bool IsValid() => true;
}