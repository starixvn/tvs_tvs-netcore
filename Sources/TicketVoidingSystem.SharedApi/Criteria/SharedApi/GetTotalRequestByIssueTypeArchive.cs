using System;
using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.SharedApi;

public class GetTotalRequestByIssueTypeArchive : CriteriaBase
{
    public string IssueTypeIds { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }

    public override string GetSettingKey() => "TicketVoiding_GetTotalRequestByIssueType_Archive";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(IssueTypeIds);
}