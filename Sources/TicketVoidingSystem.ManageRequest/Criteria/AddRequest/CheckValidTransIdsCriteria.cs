using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckValidTransIdsCriteria : CriteriaBase
{
    public string TransIds { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public int? FilterBy { get; set; }

    public int SubIssueTypeId { get; set; }

    public bool IsRemoveCustomerClass201 { get; set; }

    public bool IsRemoveCustomerClass4K { get; set; }

    public string TransInfoJson { get; set; }

    public override string GetSettingKey() => "TicketVoiding_Request_CheckAbnormalBet";

    public override bool IsValid() => true;
}