using TicketVoidingSystem.Extensions;

namespace TicketVoidingSystem.ManageRequest.Models;

public class CopyRequestInfoResponse
{
    public RequestInfoForCopy RequestInfo { get; set; }

    public IEnumerable<BetTypeTicketsInfo> BetTypeTickets { get; set; }
}

public class RequestInfoForCopy
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

    public int IssueTypeId { get; set; }

    public DateTime VoidFromTime { get; set; }

    public DateTime VoidToTime { get; set; }

    public string LiveStatus { get; set; }

    public int TotalSingleCount { get; set; }

    public int TotalParlayCount { get; set; }

    public int TotalCancelCashOutCount { get; set; }
}

public class BetTypeTicketsInfo
{
    public int BetTypeId { get; set; }
    public string BetTypeName { get; set; }
    public string InputtedRuns { get; set; }
    public string WicketOver { get; set; }
    public string PlayerName { get; set; }
    public int TicketsCount { get; set; }
}