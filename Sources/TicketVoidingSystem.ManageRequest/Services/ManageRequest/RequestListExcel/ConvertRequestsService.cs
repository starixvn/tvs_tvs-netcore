using Fanex.Data.Repository;
using HtmlAgilityPack;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface ConvertRequestsService
{
    Task<string> GetIssueTypeName(int issueId);

    Task<string> GetSubIssueTypeName(int subIssueId);

    string GetDescription(int issueId, string html);

    Task<string> GetActionName(int id);

    string GetNoOfTickets(int single, int parlay);

    string GetSportName(string html);

    string GetEvent(string html);

    string GetLeague(string html);

    string GetVarCheckValue(bool isCheckedVar);
}

public class ConvertRequestsServiceImp : ConvertRequestsService
{
    private readonly IDynamicRepository repository;

    public ConvertRequestsServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<string> GetIssueTypeName(int issueId)
    {
        var issueTypes = await repository.FetchAsync<IssueType>(new GetIssueTypeCriteria());
        var issue = issueTypes.FirstOrDefault(x => x.IssueTypeId == issueId);

        return issue?.IssueTypeName;
    }

    public async Task<string> GetSubIssueTypeName(int subIssueId)
    {
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria());
        var subIssue = subIssueTypes.FirstOrDefault(x => x.SubIssueTypeId == subIssueId);

        return subIssue?.SubIssueTypeName;
    }

    public string GetDescription(int issueId, string html)
    {
        var matchingFunctions = new Dictionary<int, Func<string, string>>
            {
                {IssueTypeConstant.AbnormalBet, BuildDescriptionAbnormalBet},
                {IssueTypeConstant.AbnormalBetRealMember, BuildDescriptionAbnormalBet},
                {IssueTypeConstant.DangerAccepted, BuildDescriptionDangerAccepted},
                {IssueTypeConstant.RedCard, BuildDescriptionDangerAccepted},
                {IssueTypeConstant.WrongHDP, BuildDescriptionDangerAccepted},
                {IssueTypeConstant.Wrong1stHDP, BuildDescriptionDangerAccepted},
                {IssueTypeConstant.WrongOU, BuildDescriptionDangerAccepted},
                {IssueTypeConstant.Wrong1stOU, BuildDescriptionDangerAccepted},
                {IssueTypeConstant.WrongOdds, BuildDescriptionDangerAccepted},
                {IssueTypeConstant.EarlyKickOffTime, BuildDescriptionEKO},
                {IssueTypeConstant.WrongKickOffTime, BuildDescriptionEKO},
                {IssueTypeConstant.WrongScore, BuildDescriptionWrongScore},
                {IssueTypeConstant.ArchivedTicket, BuildDescriptionArchivedTicket},
                {IssueTypeConstant.AbnormalAccount, BuildDescriptionAbnormalAccount},
            };

        matchingFunctions.TryGetValue(issueId, out var function);
        return function != null ? function.Invoke(html) : string.Empty;
    }

    private static string BuildDescriptionAbnormalBet(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var nodesSingle = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-single']");
        if (nodesSingle != null)
        {
            return $"Single: {nodesSingle.First().InnerText}";
        }

        var nodesParlay = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-parlay']");

        return (nodesParlay != null) ? $"Mix Parlay: {nodesParlay.First().InnerText}" : string.Empty;
    }

    private static string BuildDescriptionDangerAccepted(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var description = doc.DocumentNode.SelectNodes("//*[@class='void-time']").First().InnerText;

        return description;
    }

    private static string BuildDescriptionEKO(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var description = doc.DocumentNode.SelectNodes("//*[@class='ko-time']").First().InnerText;

        return description;
    }

    private static string BuildDescriptionWrongScore(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var description = doc.DocumentNode.SelectNodes("//*[@class='void-wrong-score']").First().InnerText;

        return description;
    }

    private static string BuildDescriptionArchivedTicket(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var totalSingle = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-single']").First().InnerText;
        var totalParlay = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-parlay']").First().InnerText;
        var description = $"Single: {totalSingle}, Parlay: {totalParlay}";

        return description;
    }

    private static string BuildDescriptionAbnormalAccount(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var voidTime = doc.DocumentNode.SelectNodes("//*[@class='void-time']").First().InnerText;
        var total = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-account']").First().InnerText;
        var description = voidTime.AppendWithNewLine($"No. of Account: {total}");

        return description;
    }

    public async Task<string> GetActionName(int id)
    {
        var actions = await repository.FetchAsync<VoidAction>(new GetActionsCriteria());
        return actions.FirstOrDefault(x => x.ActionId == id.ToString())?.ActionName;
    }

    public string GetNoOfTickets(int single, int parlay)
    {
        return single + parlay == 0 ? string.Empty : $"{single + parlay}";
    }

    public string GetSportName(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var nodes = doc.DocumentNode.SelectNodes("//*[@class='sport']");

        return (nodes != null && nodes.Any()) ? nodes.First().InnerText : string.Empty;
    }

    public string GetEvent(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var nodes = doc.DocumentNode.SelectNodes("//*[@class='match']");

        return (nodes != null && nodes.Any()) ? nodes.First().InnerText : string.Empty;
    }

    public string GetLeague(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var nodes = doc.DocumentNode.SelectNodes("//*[@class='league text-uppercase']");

        return (nodes != null && nodes.Any()) ? nodes.First().InnerText : string.Empty;
    }

    public string GetVarCheckValue(bool isCheckedVar)
    {
        return isCheckedVar ? "√" : string.Empty;
    }
}