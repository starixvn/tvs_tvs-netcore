using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckValidTransIdsCriteriaBase : OnlineServerCriteriaBase
{
    public string TransIds { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public int? FilterBy { get; set; }

    public int SubIssueTypeId { get; set; }

    public bool IsRemoveCustomerClass201 { get; set; }

    public bool IsRemoveCustomerClass4K { get; set; }

    public bool isRemoveCreditCashService { get; set; }

    public bool IsAddSettledTickets { get; set; }

    public bool IsVoidAllArchivedTickets { get; set; }

    public string OnlineServerId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_Request_CheckAbnormalBet");

    public override bool IsValid() => true;
}