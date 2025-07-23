using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetLastTimeScoreCriteria : CriteriaBase
{
    public int MatchId { get; set; }

    public DateTime FilterFromTransTime { get; set; }

    public int ActionId { get; set; }

    public int FilterBy { get; set; }

    public string OnlineServerId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_LastTime_Select");

    public override bool IsValid() => true;
}