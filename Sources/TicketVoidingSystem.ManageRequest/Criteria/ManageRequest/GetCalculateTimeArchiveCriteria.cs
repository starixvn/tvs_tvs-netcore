using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetCalculateTimeArchiveCriteria : CriteriaBase
{
    public string RequestInfoGetCalcTimes { get; set; }

    public override string GetSettingKey() => "TicketVoiding_CalculateTime_Archive_Select";

    public override bool IsValid() => true;
}
