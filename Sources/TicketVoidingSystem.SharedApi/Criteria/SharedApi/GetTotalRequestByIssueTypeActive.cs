using System;
using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.SharedApi;

public class GetTotalRequestByIssueTypeActive : CriteriaBase
{
    public string IssueTypeIds { get; set; }

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public bool IsScanArchiveRange { get; set; }

    public override string GetSettingKey() => "TicketVoiding_GetTotalRequestByIssueType";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(IssueTypeIds);
}