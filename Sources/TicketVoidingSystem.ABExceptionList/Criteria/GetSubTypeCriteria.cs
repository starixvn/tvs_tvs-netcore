using Fanex.Data.Repository;

namespace TicketVoidingSystem.ABExceptionList.Criteria;

public class GetSubTypeCriteria : CriteriaBase
{
    public override string GetSettingKey() => "TicketVoiding_ABWhiteList_SubType_Select";

    public override bool IsValid() => true;
}