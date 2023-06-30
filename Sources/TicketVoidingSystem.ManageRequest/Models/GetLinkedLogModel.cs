namespace TicketVoidingSystem.ManageRequest.Models;

public class GetLinkedLogModel
{
    public int MatchId { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public string HomeFavorite { get; set; }

    public string AwayFavorite { get; set; }

    public string HdpValue { get; set; }

    public string WrongMarket { get; set; }

    public DateTime FilterFromTransTime { get; set; }

    public DateTime FilterToTransTime { get; set; }

    public int LiveIndicator { get; set; }

    public string FilterOddsType { get; set; }

    public string FilterFavoriteType { get; set; }

    public string FilterOuType { get; set; }

    public string OddsValue { get; set; }

    public string FromOdds { get; set; }

    public string ToOdds { get; set; }

    public string BetTeam { get; set; }

    public string OuValue { get; set; }

    public string FavoriteValue { get; set; }
}