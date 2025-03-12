using Fanex.Data;
using Fanex.Data.Repository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

public class CheckValidUsernamesCriteria : CriteriaBase
{
    public string Usernames { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string ProductIds { get; set; }

    public string StatusIds { get; set; }

    public bool IsVoidAllArchivedTickets { get; set; }

    [SpParam(Ignored = true)]
    public int SiteDbGroupId { get; set; }

    public override string GetSettingKey() => Helper.GetSettingKeyBySiteDbGroupId(SiteDbGroupId, "TicketVoiding_CheckUserName");

    public override bool IsValid() => !string.IsNullOrWhiteSpace(Usernames);
}