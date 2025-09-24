using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class ReCalculateTicketCommand : OnlineServerCriteriaBase
{
    public int? MatchId { get; set; }

    public string TransIds { get; set; }

    public int UserId { get; set; }

    public string Ip { get; set; }

    public string NegativeBalanceUsers { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_ReCalculate_Single_PreUpdate");

    public override bool IsValid() => true;
}