using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckRecoverTicketCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public int? RequestId { get; set; }

    public int? FilterBy { get; set; }

    public string ProductIds { get; set; }

    public int MatchId { get; set; }

    public bool IsVoidAllArchivedTickets { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_Request_CheckRecoverTicket");

    public override bool IsValid() => true;
}