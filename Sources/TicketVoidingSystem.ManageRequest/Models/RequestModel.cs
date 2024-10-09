using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace TicketVoidingSystem.ManageRequest.Models;

public class RequestModel
{
    public int RequestId { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public int? MatchId { get; set; }
    public DateTime KickOffTime { get; set; }
    public DateTime EventDate { get; set; }
    public int SportType { get; set; }
    public int LeagueId { get; set; }
    public int HomeId { get; set; }
    public int AwayId { get; set; }
    public string MatchCode { get; set; }
    public byte ActionId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string LastPerformedBy { get; set; }
    public string CheckedBy { get; set; }
    public int TotalSingle { get; set; }
    public int TotalParlay { get; set; }
    public int TotalSingleProcessed { get; set; }
    public int TotalParlayProcessed { get; set; }
    public int TotalCancelCashOutProcessed { get; set; }
    public int TotalResettleProcessed { get; set; }
    public string Status { get; set; }
    public IEnumerable<string> BettypeNames { get; set; }
    public int? FilterBy { get; set; }
    public DateTime VoidFromTime { get; set; }
    public DateTime VoidToTime { get; set; }
    public DateTime FromWinlostDate { get; set; }
    public DateTime ToWinlostDate { get; set; }
    public int TotalUserName { get; set; }
    public string WrongScores { get; set; }
    public string SettlementStatus { get; set; }
    public string RequestExtraInfo { get; set; }
    public DateTime? CalcHalfTime { get; set; }
    public DateTime? CalcFullTime { get; set; }
    public string Products { get; set; }

    public bool IsCheckedVar
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsCheckedVar;
        }
    }

    public DateTime KickOffTimeMatch { get; set; }
    public DateTime EventDateMatch { get; set; }
    public string Provider { get; set; }
    public string Source { get; set; }
    public string Remark { get; set; }
    public string Trader { get; set; }
    public string LA { get; set; }
    public string TVAndIPTV { get; set; }
    public string Message { get; set; }
    public int? ParentMatchId { get; set; }
    public int VendorMatchId { get; set; }
    public int RaceId { get; set; }
}

public class IgnoreDuplicateAbnormalAccountEqualityComparer : IEqualityComparer<RequestModel>
{
    public bool Equals(RequestModel x, RequestModel y)
    {
        if (x == null && y == null)
        {
            return true;
        }

        if (x is null || y is null)
        {
            return false;
        }

        if (x.GetType() != y.GetType())
        {
            return false;
        }
        return x.RequestId == y.RequestId && x.IssueTypeId == IssueTypeConstant.AbnormalAccount;
    }

    public int GetHashCode(RequestModel obj)
    {
        return HashCode.Combine(obj.RequestId, obj.IssueTypeId);
    }
}