using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetTransInfoForVoidCriteria : CriteriaBase
{
    public string SingleTransIds { get; set; }
    public string ParlayTransIds { get; set; }
    public string CancelCashOutTransIds { get; set; }

    public int? MatchId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_TransInfo_Void_Select");

    public override bool IsValid() => true;
}