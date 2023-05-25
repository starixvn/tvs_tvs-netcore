using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetCalculateTimeCriteria : CriteriaBase
{
    public string RequestInfoGetCalcTimes { get; set; }

    public override string GetSettingKey() => "TicketVoiding_CalculateTime_Select";

    public override bool IsValid() => true;
}

