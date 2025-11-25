using Fanex.Data.Repository;

namespace TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;

public class SelectArchivedRemarksCriteria : CriteriaBase
{
    public int? RemarkId { get; set; }
    public int? MatchId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? ActionIds { get; set; }
    public string? CreatedBy { get; set; }
    public bool? IsExcludeTest { get; set; }

    public override string GetSettingKey() => "TicketVoiding_RemarkList_Archive_Select";

    public override bool IsValid() => true;
}