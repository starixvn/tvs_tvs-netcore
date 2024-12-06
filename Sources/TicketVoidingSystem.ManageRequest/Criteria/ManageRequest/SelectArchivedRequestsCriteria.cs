using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;

public class SelectArchivedRequestsCriteria : CriteriaBase
{
    public string RequestInfoJson { get; set; }

    public int? MatchId { get; set; }

    public string IssueTypeId { get; set; }

    public string SubIssueType { get; set; }

    public int Status { get; set; }

    public bool IsExcludeTest { get; set; }

    public int CreatedBy { get; set; }

    public string ProductIds { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RequestList_Archive_Select";

    public override bool IsValid() => true;
}