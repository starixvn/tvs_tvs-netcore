using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetArchivedRequestInfoCriteria : CriteriaBase
{
    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RequestListInfo_Archive_Select";

    public override bool IsValid() => true;
}