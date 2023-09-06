using Fanex.Data.Repository;

namespace TicketVoidingSystem.Criteria.SendEmail;

public class DuplicateTicketsRequestInfoCriteria : CriteriaBase
{
    public int RequestId { get; set; }

    public int VoidingHistoryId { get; set; }

    public override string GetSettingKey() => "TicketVoiding_DuplicateTickets_TransIds_Select";

    public override bool IsValid() => true;
}