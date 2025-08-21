using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Criteria.Permission;

public class GetTransInfoForCheckVoidPermissionCriteria : CriteriaBase
{
    public string TransIds { get; set; }
    public string CancelCashOutTransIds { get; set; }
    public string OnlineServerId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_CheckVoidBetPermission_TransInfo");

    public override bool IsValid() => true;
}