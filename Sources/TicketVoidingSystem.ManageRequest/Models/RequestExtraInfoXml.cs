using System.Xml.Serialization;

namespace TicketVoidingSystem.ManageRequest.Models;

[XmlRoot(ElementName = "r")]
public class RequestExtraInfoXml
{
    [XmlAttribute(AttributeName = "AA")]
    public string AATime { get; set; }

    [XmlAttribute(AttributeName = "PA")]
    public string PATime { get; set; }

    [XmlAttribute(AttributeName = "SA")]
    public string SATime { get; set; }

    [XmlAttribute(AttributeName = "IsMainMatch")]
    public bool IsMainMatch { get; set; }

    [XmlAttribute(AttributeName = "ScoreId")]
    public string ScoreId { get; set; }

    [XmlAttribute(AttributeName = "HomeFavorite")]
    public string HomeFavorite { get; set; }

    [XmlAttribute(AttributeName = "AwayFavorite")]
    public string AwayFavorite { get; set; }

    [XmlAttribute(AttributeName = "ActualMarket")]
    public string ActualMarket { get; set; }

    [XmlAttribute(AttributeName = "WrongMarket")]
    public string WrongMarket { get; set; }

    [XmlAttribute(AttributeName = "HdpValue")]
    public string HdpValue { get; set; }

    [XmlAttribute(AttributeName = "PoolHouseCheckedBetTypes")]
    public string PoolHouseCheckedBetTypes { get; set; }

    [XmlAttribute(AttributeName = "IsLinkGroup1X2")]
    public bool IsLinkGroup1X2 { get; set; }

    [XmlAttribute(AttributeName = "IsLinkGroupAIO")]
    public bool IsLinkGroupAIO { get; set; }

    [XmlAttribute(AttributeName = "LiveIndicator")]
    public int LiveIndicator { get; set; }

    [XmlAttribute(AttributeName = "IsCheckedVar")]
    public bool IsCheckedVar { get; set; }

    [XmlAttribute(AttributeName = "BetTypeIds")]
    public string BetTypeIds { get; set; } // ReducedOver + NotParticipate multiple option

    [XmlAttribute(AttributeName = "WicketOver")]
    public string WicketOver { get; set; }

    [XmlAttribute(AttributeName = "PlayerIds")]
    public string PlayerIds { get; set; }

    [XmlAttribute(AttributeName = "Runs")]
    public string Runs { get; set; }

    [XmlAttribute(AttributeName = "Live")]
    public bool Live { get; set; }

    [XmlAttribute(AttributeName = "NonLive")]
    public bool NonLive { get; set; }

    [XmlAttribute(AttributeName = "PlayerId")]
    public int PlayerId { get; set; } // NotParticipate

    // value filter Wrong Odds
    [XmlAttribute(AttributeName = "FilterFavoriteType")]
    public string FilterFavoriteType { get; set; }

    [XmlAttribute(AttributeName = "FavoriteValue")]
    public string FavoriteValue { get; set; }

    [XmlAttribute(AttributeName = "WrongOU")]
    public string WrongOU { get; set; }

    [XmlAttribute(AttributeName = "Spread")]
    public string Spread { get; set; }

    [XmlAttribute(AttributeName = "AllowanceRate")]
    public string AllowanceRate { get; set; }

    [XmlAttribute(AttributeName = "CorrectOddsHomeOver")]
    public string CorrectOddsHomeOver { get; set; }

    [XmlAttribute(AttributeName = "CorrectOddsAwayUnder")]
    public string CorrectOddsAwayUnder { get; set; }

    [XmlAttribute(AttributeName = "FromOddsNotVoidHomeOver")]
    public string FromOddsNotVoidHomeOver { get; set; }

    [XmlAttribute(AttributeName = "ToOddsNotVoidHomeOver")]
    public string ToOddsNotVoidHomeOver { get; set; }

    [XmlAttribute(AttributeName = "FromOddsNotVoidAwayUnder")]
    public string FromOddsNotVoidAwayUnder { get; set; }

    [XmlAttribute(AttributeName = "ToOddsNotVoidAwayUnder")]
    public string ToOddsNotVoidAwayUnder { get; set; }

    // Wrong Odds Sports Book
    [XmlAttribute(AttributeName = "FilterOddsType")]
    public string FilterOddsType { get; set; }

    [XmlAttribute(AttributeName = "OddsValue")]
    public string OddsValue { get; set; }

    [XmlAttribute(AttributeName = "FromOdds")]
    public string FromOdds { get; set; }

    [XmlAttribute(AttributeName = "ToOdds")]
    public string ToOdds { get; set; }

    [XmlAttribute(AttributeName = "CorrectOdds")]
    public string CorrectOdds { get; set; }

    // Wrong Offered Name
    [XmlAttribute(AttributeName = "CurrencyIds")]
    public string CurrencyIds { get; set; }

    [XmlAttribute(AttributeName = "LicenseeNames")]
    public string LicenseeNames { get; set; }

    [XmlAttribute(AttributeName = "WrongName")]
    public string WrongName { get; set; }

    [XmlAttribute(AttributeName = "ActualName")]
    public string ActualName { get; set; }

    [XmlAttribute(AttributeName = "WrongNameT")]
    public string WrongNameT { get; set; }

    [XmlAttribute(AttributeName = "ActualNameT")]
    public string ActualNameT { get; set; }

    [XmlAttribute(AttributeName = "WrongNameS")]
    public string WrongNameS { get; set; }

    [XmlAttribute(AttributeName = "ActualNameS")]
    public string ActualNameS { get; set; }

    [XmlAttribute(AttributeName = "FilterBetIdX")]
    public string FilterBetIdX { get; set; }

    [XmlAttribute(AttributeName = "FilterBetIdY")]
    public string FilterBetIdY { get; set; }

    [XmlAttribute(AttributeName = "FilterBetTypeId")]
    public string FilterBetTypeId { get; set; }
}