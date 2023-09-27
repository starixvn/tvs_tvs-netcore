using TicketVoidingSystem.Extensions;

namespace TicketVoidingSystem.ManageRequest.Models;

public class CopyRequestInfoModel
{
    public string RequestId { get; set; }

    public int MatchId { get; set; }

    public bool IsNeutral { get; set; }

    public int HomeId { get; set; }

    public int AwayId { get; set; }

    public int LeagueId { get; set; }

    public string MatchEvent { get; set; }

    public string LeagueName { get; set; }

    public DateTime GlobalShowTime { get; set; }

    public int FilterBy { get; set; }

    public DateTime StartVoidTime { get; set; }

    public string IssueTypeName { get; set; }

    public string SubIssueTypeName { get; set; }

    public string RequestExtraInfo { get; set; }

    public bool IsCheckedVar
    {
        get
        {
            var root = RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
            return root.IsCheckedVar;
        }
    }

    public string OperatorInfo { get; set; }

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

    public string Provider { get; set; }

    public string RequestedBy { get; set; }

    public bool IsHasSettledTicket { get; set; }

    public string Remark { get; set; }
}