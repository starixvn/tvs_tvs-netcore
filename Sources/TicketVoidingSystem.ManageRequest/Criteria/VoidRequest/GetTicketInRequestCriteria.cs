using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

public class GetTicketInRequestCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public int? RequestDetailId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_TicketRequest_Void_Select";

    public override bool IsValid() => RequestId > 0;
}