using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class WrongOuViewModel
{
    public int MatchId { get; set; }
    public string? MatchCode { get; set; }
    public string? Name { get; set; }
    public string? LeagueName { get; set; }
    public bool IsMainMatch { get; set; }
    public int IssueTypeId { get; set; }
    public int SubIssueTypeId { get; set; }
    public DateTime? EventDate { get; set; }
    public DateTime? FilterFromTransTime { get; set; }
    public DateTime? FilterToTransTime { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
    public string? ActualMarket { get; set; }
    public string? WrongMarket { get; set; }
    public int LiveIndicator { get; set; }
    public string? PoolHouseCheckedBetTypes { get; set; }
    public bool IsLinkGroup1X2 { get; set; }
    public bool IsLinkGroupAIO { get; set; }
    public LogInfoDetail? LogInfoDetail { get; set; }
    public int SportType { get; set; }

    public string FilterBetIdX { get; set; }

    public string FilterBetIdY { get; set; }

    public string FilterBetTypeId { get; set; }
}