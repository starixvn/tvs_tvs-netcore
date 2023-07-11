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

    public DateTime KickOffTime { get; set; }

    public bool IsVar { get; set; }

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
    public string Provider { get; set; }
}

public class CopyRequestInfoResponse
{
    public string Info { get; set; }
}