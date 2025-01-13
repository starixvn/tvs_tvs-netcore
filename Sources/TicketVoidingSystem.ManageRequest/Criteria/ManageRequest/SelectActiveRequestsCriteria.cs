using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class SelectActiveRequestsCriteria : CriteriaBase
{
    public string RequestId { get; set; }

    public string RequestInfoJson { get; set; }

    public string? MatchId { get; set; }

    public string IssueTypeId { get; set; }

    public string SubIssueType { get; set; }

    public int Status { get; set; }

    public bool IsExcludeTest { get; set; }

    public int CreatedBy { get; set; }

    public string ProductTypeIds { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RequestList_Select";

    public override bool IsValid() => true;
}