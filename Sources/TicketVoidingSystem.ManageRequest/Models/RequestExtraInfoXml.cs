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
}