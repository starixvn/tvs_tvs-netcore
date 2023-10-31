namespace SpecialDelete.VoidByBetId.ViewModels;

public class ResultCheckAbnormalBetViewModel
{
    public string InvalidTransIds { get; set; }
    public string MovedTransIds { get; set; }
    public string DifferentMatchTransIds { get; set; }
    public string InvalidMatchId { get; set; }
}