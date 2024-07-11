namespace TicketVoidingSystem.ManageRequest.Models;

public class GetLinkedLogModel
{
    public int MatchId { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public string? HomeFavorite { get; set; }

    public string? AwayFavorite { get; set; }

    public string? HdpValue { get; set; }

    public string? WrongMarket { get; set; }

    public DateTime FilterFromTransTime { get; set; }

    public DateTime FilterToTransTime { get; set; }

    public int LiveIndicator { get; set; }

    public string? FilterFavoriteType { get; set; }

    public string? FavoriteValue { get; set; }

    public string? WrongOU { get; set; }

    public string? Spread { get; set; }

    public string? AllowanceRate { get; set; }

    public string? CorrectOddsHomeOver { get; set; }

    public string? CorrectOddsAwayUnder { get; set; }

    public string? FromOddsNotVoidHomeOver { get; set; }

    public string? ToOddsNotVoidHomeOver { get; set; }

    public string? FromOddsNotVoidAwayUnder { get; set; }

    public string? ToOddsNotVoidAwayUnder { get; set; }
}