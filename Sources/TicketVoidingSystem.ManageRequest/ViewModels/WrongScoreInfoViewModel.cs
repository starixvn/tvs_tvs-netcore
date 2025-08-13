namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class WrongScoreInfoViewModel
{
    public int ScoreId { get; set; }
    public bool IsActive { get; set; }
    public bool IsChecked { get; set; }
    public string? WrongScore { get; set; }
    public int? FilterBy { get; set; }
    public DateTime? FilterFromTransTime { get; set; }
    public DateTime? FilterToTransTime { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
    public string? ActualScore { get; set; }
    public int MatchId { get; set; }
    public int SubIssueTypeId { get; set; }
    public DateTime? EventDate { get; set; }
    public int? AATime { get; set; }
    public int? PATime { get; set; }
    public int? SATime { get; set; }
    public bool? IsCheckedVar { get; set; }
    public int TvDetectionValue { get; set; }
    public string ServiceAcceptTime { get; set; }
    public string ActualTime { get; set; }
    public int? MinuteOffset { get; set; }
    public int? SecondOffset { get; set; }
    public bool IsMainMatch { get; set; }
}