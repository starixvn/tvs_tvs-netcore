using Fanex.Data.Repository;

namespace TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;

public class GetDataForConfirmAutoUnmarkCriteria : CriteriaBase
{
    public string TransInfoJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_AutoUnmark_Select";

    public override bool IsValid() => true;
}