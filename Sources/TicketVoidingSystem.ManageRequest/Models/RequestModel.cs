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
    public byte ActionId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string LastPerformedBy { get; set; }
    public string CheckedBy { get; set; }
    public int TotalSingle { get; set; }
    public int TotalParlay { get; set; }
    public int TotalVoidedSingle { get; set; }
    public int TotalVoidedParlay { get; set; }
    public int TotalCancelCashOut { get; set; }
    public string Status { get; set; }
    public IEnumerable<string> BettypeNames { get; set; }
    public string TransIds { get; set; }
    public int? FilterBy { get; set; }
    public DateTime VoidFromTime { get; set; }
    public DateTime VoidToTime { get; set; }
    public DateTime FromWinlostDate { get; set; }
    public DateTime ToWinlostDate { get; set; }
    public int TotalUserName { get; set; }
    public string WrongScores { get; set; }
    public string SettlementStatus { get; set; }
    public string RequestExtraInfo { get; set; }

    public bool IsCheckedVar
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsCheckedVar;
        }
    }
}