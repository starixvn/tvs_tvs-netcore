using System.Text.Json.Serialization;
using System.Xml.Serialization;
using TicketVoidingSystem.Extensions;
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

    public List<OperatorInfo> Operators
    {
        get
        {
            var root = OperatorInfo.ParseXmlToObject<RootOperators>();
            var operators = root.OperatorXmls;
            var result = operators.Count > 0 ? operators.Select(x =>
                new OperatorInfo { OperatorId = x.OperatorId, OperatorType = x.TypeId }
            ).ToList() : new List<OperatorInfo>();
            return result;
        }
    }

    public string RequestedBy { get; set; }

    public int UserId { get; set; }

    public string VoidedBy { get; set; }
}

[XmlRoot(ElementName = "r")]
public class OperatorXml
{
    [XmlAttribute(AttributeName = "OperatorId")]
    public int OperatorId { get; set; }

    [XmlAttribute(AttributeName = "TypeId")]
    public byte TypeId { get; set; }
}

[XmlRoot(ElementName = "root")]
public class RootOperators
{
    public RootOperators()
    {
        OperatorXmls = new List<OperatorXml>();
    }

    [XmlElement(ElementName = "r")]
    public List<OperatorXml> OperatorXmls { get; set; }
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

    public int? AATime
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            if (root == null || string.IsNullOrWhiteSpace(root.AATime))
            {
                return null;
            }
            return int.Parse(root.AATime);
        }
    }

    public int? PATime
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            if (root == null || string.IsNullOrWhiteSpace(root.PATime))
            {
                return null;
            }
            return int.Parse(root.PATime);
        }
    }

    public int? SATime
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            if (root == null || string.IsNullOrWhiteSpace(root.SATime))
            {
                return null;
            }
            return int.Parse(root.SATime);
        }
    }

    public int ScoreId
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            if (root == null || string.IsNullOrWhiteSpace(root.ScoreId))
            {
                return 0;
            }
            return int.Parse(root.ScoreId);
        }
    }

    public bool IsMainMatch
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsMainMatch;
        }
    }

    public string HomeFavorite
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.HomeFavorite;
        }
    }

    public string AwayFavorite
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.AwayFavorite;
        }
    }

    public string ActualMarket
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.ActualMarket;
        }
    }

    public string WrongMarket
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.WrongMarket;
        }
    }

    public string HdpValue
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.HdpValue;
        }
    }

    public bool IsCheckedVar
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsCheckedVar;
        }
    }

    public string PoolHouseCheckedBetTypes
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.PoolHouseCheckedBetTypes;
        }
    }

    public bool IsLinkGroup1X2
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsLinkGroup1X2;
        }
    }

    public bool IsLinkGroupAIO
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsLinkGroupAIO;
        }
    }

    public int LiveIndicator
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.LiveIndicator;
        }
    }

    public string FilterOddsType
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.FilterOddsType;
        }
    }

    public string FilterFavoriteType
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.FilterFavoriteType;
        }
    }

    public string FilterOuType
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.FilterOuType;
        }
    }

    public string OddsValue
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.OddsValue;
        }
    }

    public string FromOdds
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.FromOdds;
        }
    }

    public string ToOdds
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.ToOdds;
        }
    }

    public string CorrectOdds
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.CorrectOdds;
        }
    }

    public string BetTeam
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.BetTeam;
        }
    }

    public string OuValue
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.OuValue;
        }
    }

    public string FavoriteValue
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.FavoriteValue;
        }
    }

    public string BetTypeIds
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.BetTypeIds;
        }
    }

    public string WicketOver
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.WicketOver;
        }
    }

    public string PlayerIds
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.PlayerIds;
        }
    }

    public string Runs
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.Runs;
        }
    }

    public bool Live
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.Live;
        }
    }

    public bool NonLive
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.NonLive;
        }
    }

    public int PlayerId
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.PlayerId;
        }
    }

    public string GroupBetTypeIds
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.GroupBetTypeIds;
        }
    }

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
}