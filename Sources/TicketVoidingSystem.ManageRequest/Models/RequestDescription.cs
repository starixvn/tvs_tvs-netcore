namespace TicketVoidingSystem.ManageRequest.Models;

public class RequestDescription
{
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public DateTime KickOffTime { get; set; }
    public int SportType { get; set; }
    public int LeagueId { get; set; }
    public int HomeId { get; set; }
    public int AwayId { get; set; }
    public List<string> BettypeNames { get; set; }
    public int? FilterBy { get; set; }
    public DateTime VoidFromTime { get; set; }
    public DateTime VoidToTime { get; set; }

    public string MatchEvent => $"{HomeName} - vs - {AwayName}";
    public string HomeName { get; set; }
    public string AwayName { get; set; }
    public string LeagueName { get; set; }
    public string SportTypeName { get; set; }

    public int FromLogId { get; set; }
    public int ToLogId { get; set; }
    public int TotalSingle { get; set; }
    public int TotalParlay { get; set; }
    public DateTime FromWinlostDate { get; set; }
    public DateTime ToWinlostDate { get; set; }
    public int TotalUserName { get; set; }
    public string WrongScores { get; set; }
    public bool IsCheckedVar { get; set; }
}