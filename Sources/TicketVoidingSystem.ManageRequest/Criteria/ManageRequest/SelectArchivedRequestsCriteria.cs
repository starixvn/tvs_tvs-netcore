using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class SelectArchivedRequestsCriteria : CriteriaBase
{
    public string RequestInfoJson { get; set; }

    public string? MatchId { get; set; }

    public string IssueTypeId { get; set; }

    public string SubIssueType { get; set; }

    public string StatusIds { get; set; }

    public bool IsExcludeTest { get; set; }

    public int CreatedBy { get; set; }

    public string ProductTypeIds { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RequestList_Archive_Select";

    public override bool IsValid() => true;
}