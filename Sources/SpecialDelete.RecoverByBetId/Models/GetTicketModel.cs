using TicketVoidingSystem.Models;

namespace SpecialDelete.RecoverByBetId.Models;

public class GetTicketModel
{
    public long BetId { get; set; }

    public long TransId { get; set; }

    public int BetType { get; set; }

    public string BetTeam { get; set; }

    public decimal Stake { get; set; }

    public decimal Odds { get; set; }

    public byte OddsType { get; set; }

    public decimal Hdp1 { get; set; }

    public decimal Hdp2 { get; set; }

    public string WinLost { get; set; }

    public string Status { get; set; }

    public bool IsLiveIndicator { get; set; }

    public int LiveHomeScore { get; set; }

    public int LiveAwayScore { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int SportTypeId { get; set; }

    public int LeagueId { get; set; }

    public bool IsNeutral { get; set; }

    public long RefNo { get; set; }

    public string MatchCode { get; set; }

    public string MatchId { get; set; }

    public DateTime EndTime { get; set; }

    public string BetCheck { get; set; }

    public string TransDesc { get; set; }

    public string UserName { get; set; }

    public DateTime TransDate { get; set; }

    public string GroupName { get; set; }

    public string CurrencyName { get; set; }

    public int SiteDbGroupId { get; set; }

    public decimal MasterOdds { get; set; }
}

public class GetTicketValidation : Result
{
    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }
}