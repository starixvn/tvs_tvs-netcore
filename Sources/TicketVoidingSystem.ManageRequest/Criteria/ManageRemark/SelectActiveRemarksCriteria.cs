using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;

public class SelectActiveRemarksCriteria : CriteriaBase
{
    public int? RemarkId { get; set; }
    public int? MatchId { get; set; }
    public string? FromDate { get; set; }
    public string? ToDate { get; set; }
    public string? ActionIds { get; set; }
    public string? CreatedBy { get; set; }
    public bool? IsExcludeTest { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RemarkList_Select";

    public override bool IsValid() => true;
}

