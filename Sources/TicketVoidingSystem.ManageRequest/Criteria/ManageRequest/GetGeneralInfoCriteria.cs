using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class GetGeneralInfoCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public string MatchIds { get; set; }

    public override string GetSettingKey() => "TicketVoiding_GeneralInfo_Select";

    public override bool IsValid() => true;
}