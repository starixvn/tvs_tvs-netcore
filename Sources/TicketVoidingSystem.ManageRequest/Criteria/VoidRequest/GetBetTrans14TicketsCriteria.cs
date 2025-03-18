using Fanex.Data;
using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetBetTrans14TicketsCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Void14_Select";

    public override bool IsValid() => true;
}