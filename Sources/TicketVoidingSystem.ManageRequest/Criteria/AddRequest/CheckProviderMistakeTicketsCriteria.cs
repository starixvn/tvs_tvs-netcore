using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckProviderMistakeTicketsCriteria : CriteriaBase
{
    public int SiteDbGroupId { get; set; }
    public string TransIds { get; set; }
    public string TransInfoJson { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_TechnicalError_CheckProviderMistakeTickets");
    public override bool IsValid() => true;
} 