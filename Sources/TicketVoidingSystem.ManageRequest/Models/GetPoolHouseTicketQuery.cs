using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Models;

public class GetPoolHouseTicketQuery
{
    public int MatchId { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public string? HomeFavorite { get; set; }

    public string? AwayFavorite { get; set; }

    public string? HdpValue { get; set; }

    public string? WrongMarket { get; set; }

    public bool IsLinkGroup1X2 { get; set; }

    public bool IsLinkGroupAIO { get; set; }

    public DateTime FilterFromTransTime { get; set; }

    public DateTime FilterToTransTime { get; set; }

    public int LiveIndicator { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public IEnumerable<WrongOddsViewModel>? WrongOddsInfo { get; set; }
}