using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetBettypeNamesArchiveCriteria : CriteriaBase
{
    public string RequestInfo { get; set; }

    public override string GetSettingKey() => "TicketVoiding_BettypesForRequest_Archive_Select";

    public override bool IsValid() => true;
}