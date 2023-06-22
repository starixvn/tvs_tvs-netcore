using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetActiveRequestInfoCriteria : CriteriaBase
{
    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RequestListInfo_Select";

    public override bool IsValid() => true;
}