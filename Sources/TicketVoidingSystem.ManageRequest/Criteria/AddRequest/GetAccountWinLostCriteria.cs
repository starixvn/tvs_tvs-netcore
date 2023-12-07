using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class GetAccountWinLostCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_AccountWinLost_Select";

    public override bool IsValid() => true;
}