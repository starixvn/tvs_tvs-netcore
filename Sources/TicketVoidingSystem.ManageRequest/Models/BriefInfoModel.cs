namespace TicketVoidingSystem.ManageRequest.Models;

public class BriefInfoModel : TicketLicenseeModel
{
    public IEnumerable<UserVoidMessage> UserVoidMessages { get; set; }
}

public class TicketLicenseeModel
{
    public int? MatchId { get; set; }

    public string AffectedLicenseeNames { get; set; }

    public string CancelCashOutLicenseesNames { get; set; }

    public string ChinaViewLicenseesNames { get; set; }
}