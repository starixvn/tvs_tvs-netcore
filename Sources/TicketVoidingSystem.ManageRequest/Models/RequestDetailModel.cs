using System.Text.Json.Serialization;
using TicketVoidingSystem.Web.JsonConverter;

namespace TicketVoidingSystem.ManageRequest.Models;

public class RequestDetailModel
{
    public int RequestId { get; set; }
    public int SportType { get; set; }
    public int IssueTypeId { get; set; }
    public int ActionId { get; set; }
    public string MistakenBy { get; set; }
    public string DecidedBy { get; set; }
    public string OperatorInfo { get; set; }
    public string Provider { get; set; }
    public string Source { get; set; }
    public string Remark { get; set; }
    public bool IsTest { get; set; }
    public bool IsVoided { get; set; }

    public IEnumerable<OperatorInfo> Operators { get; set; }

    public string RequestedBy { get; set; }

    public int UserId { get; set; }

    public string VoidedBy { get; set; }
}

public class RequestEventModel
{
    public int MatchId { get; set; }
    public string MatchCode { get; set; }
    public DateTime? EventDate { get; set; }
    public int ParentId { get; set; }
    public int LeagueId { get; set; }
    public int HomeId { get; set; }
    public int AwayId { get; set; }
    public bool IsNeutral { get; set; }
    public string TransIds { get; set; }
    public string OrgTransIds { get; set; }

    [JsonConverter(typeof(GMT8DateTimeJsonConverter))]
    public DateTime? KickOffTime { get; set; }

    public int? HTHomeScore { get; set; }
    public int? HTAwayScore { get; set; }
    public int? FinalHomeScore { get; set; }
    public int? FinalAwayScore { get; set; }
    public DateTime? GlobalShowTime { get; set; }
    public DateTime? VoidFromTime { get; set; }
    public DateTime? VoidToTime { get; set; }
    public DateTime FilterFromTransTime { get; set; }
    public DateTime FilterToTransTime { get; set; }
    public string FilterFromBetId { get; set; }
    public string FilterToBetId { get; set; }
    public int? FilterBy { get; set; }

    public int? AATime { get; set; }

    public int? PATime { get; set; }

    public int? SATime { get; set; }

    public int ScoreId { get; set; }

    public bool IsMainMatch { get; set; }

    public string HomeFavorite { get; set; }

    public string AwayFavorite { get; set; }

    public string ActualMarket { get; set; }

    public string WrongMarket { get; set; }

    public string HdpValue { get; set; }

    public bool IsCheckedVar { get; set; }

    public string PoolHouseCheckedBetTypes { get; set; }

    public bool IsLinkGroup1X2 { get; set; }

    public bool IsLinkGroupAIO { get; set; }

    public int LiveIndicator { get; set; }

    public string BetTypeIds { get; set; }

    public string WicketOver { get; set; }

    public string PlayerIds { get; set; }

    public string Runs { get; set; }

    public bool Live { get; set; }

    public bool NonLive { get; set; }

    public int PlayerId { get; set; }

    public string AdvancedExtraInfo { get; set; }
    public string RequestExtraInfo { get; set; }

    public string Usernames { get; set; }
    public string ProductIds { get; set; }
    public string StatusIds { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }

    // event wrong score
    public string WrongScore { get; set; }

    public string ActualScore { get; set; }
    public int SubIssueTypeId { get; set; }

    //event wrong odds
    public string FilterFavoriteType { get; set; }

    public string FavoriteValue { get; set; }
    public string WrongOU { get; set; }
    public string Spread { get; set; }
    public string AllowanceRate { get; set; }
    public string CorrectOddsHomeOver { get; set; }
    public string CorrectOddsAwayUnder { get; set; }
    public string FromOddsNotVoidHomeOver { get; set; }
    public string ToOddsNotVoidHomeOver { get; set; }
    public string FromOddsNotVoidAwayUnder { get; set; }
    public string ToOddsNotVoidAwayUnder { get; set; }
}