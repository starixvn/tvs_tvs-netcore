using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Models;

public class RequestDescription : Match
{
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public List<string> BettypeNames { get; set; }
    public int? FilterBy { get; set; }
    public DateTime VoidFromTime { get; set; }
    public DateTime VoidToTime { get; set; }
    public int FromLogId { get; set; }
    public int ToLogId { get; set; }
    public int TotalSingle { get; set; }
    public int TotalParlay { get; set; }
    public DateTime FromWinlostDate { get; set; }
    public DateTime ToWinlostDate { get; set; }
    public int TotalUserName { get; set; }
    public string WrongScores { get; set; }
    public bool IsCheckedVar { get; set; }
    public string Products { get; set; }
}