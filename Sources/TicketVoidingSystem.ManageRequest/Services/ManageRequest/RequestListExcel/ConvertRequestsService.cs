using Fanex.Data.Repository;
using HtmlAgilityPack;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface ConvertRequestsService
{
    Task<IEnumerable<IssueType>> GetAllIssueTypes();

    Task<IEnumerable<SubIssueType>> GetAllSubIssueTypes();

    Task<IEnumerable<VoidAction>> GetAllVoidActions();

    string GetIssueTypeName(int issueId, IEnumerable<IssueType> issueTypes);

    string GetSubIssueTypeName(int subIssueId, IEnumerable<SubIssueType> subIssueTypes);

    string GetDescription(int issueId, string html);

    string GetVoidActionName(int id, IEnumerable<VoidAction> voidActions);

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

    public async Task<IEnumerable<IssueType>> GetAllIssueTypes()
    {
        return await repository.FetchAsync<IssueType>(new GetIssueTypeCriteria());
    }

    public async Task<IEnumerable<SubIssueType>> GetAllSubIssueTypes()
    {
        return await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria());
    }

    public async Task<IEnumerable<VoidAction>> GetAllVoidActions()
    {
        return await repository.FetchAsync<VoidAction>(new GetActionsCriteria());
    }

    public string GetIssueTypeName(int issueId, IEnumerable<IssueType> issueTypes)
    {
        var issue = issueTypes.FirstOrDefault(x => x.IssueTypeId == issueId);

        return issue?.IssueTypeName;
    }

    public string GetSubIssueTypeName(int subIssueId, IEnumerable<SubIssueType> subIssueTypes)
    {
        var subIssueName = subIssueTypes
            .Where(x => x.SubIssueTypeId == subIssueId).Select(x => x.SubIssueTypeName)
            .FirstOrDefault();

        return subIssueName;
    }

    public string GetDescription(int issueId, string html)
    {
        var matchingFunctions = new Dictionary<int, Func<string, string>>
            {
                {IssueTypeConstant.AbnormalBet, BuildTotalSingleOrMixParlay},
                {IssueTypeConstant.AbnormalBetRealMember, BuildTotalSingleOrMixParlay},
                {IssueTypeConstant.DangerAccepted, BuildVoidTime},
                {IssueTypeConstant.RedCard, BuildVoidTime},
                {IssueTypeConstant.WrongHDP, BuildVoidTime},
                {IssueTypeConstant.Wrong1stHDP, BuildVoidTime},
                {IssueTypeConstant.WrongOU, BuildVoidTime},
                {IssueTypeConstant.Wrong1stOU, BuildVoidTime},
                {IssueTypeConstant.WrongOdds, BuildVoidTime},
                {IssueTypeConstant.ReducedOver, _ => string.Empty},
                {IssueTypeConstant.EarlyKickOffTime, BuildKickOffTime},
                {IssueTypeConstant.WrongKickOffTime, BuildKickOffTime},
                {IssueTypeConstant.WrongScore, BuildVoidWrongScore},
                {IssueTypeConstant.ArchivedTicket, BuildTotalSingleAndParlay},
                {IssueTypeConstant.AbnormalAccount, BuildVoidTimeAndTotalAccount},
                {IssueTypeConstant.DuplicateTickets, BuildTotalSingleOrParlay},
                {IssueTypeConstant.RecoverTicket, BuildProducts}
            };

        matchingFunctions.TryGetValue(issueId, out var function);
        return function != null ? function.Invoke(html) : string.Empty;
    }

    private static string BuildTotalSingleOrMixParlay(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var nodesSingle = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-single']");
        if (nodesSingle != null)
        {
            return $"Single: {nodesSingle[0].InnerText}";
        }

        var nodesParlay = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-parlay']");
        if (nodesParlay != null)
        {
            return $"Mix Parlay: {nodesParlay[0].InnerText}";
        }

        var nodesSystemParlay = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-system-parlay']");

        return nodesSystemParlay != null ? $"System Parlay: {nodesSystemParlay[0].InnerText}" : string.Empty;
    }

    private static string BuildTotalSingleOrParlay(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var nodesSingle = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-single']");
        if (nodesSingle != null)
        {
            return $"Single: {nodesSingle[0].InnerText}";
        }

        var nodesParlay = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-parlay']");

        return nodesParlay != null ? $"Parlay: {nodesParlay[0].InnerText}" : string.Empty;
    }

    private static string BuildVoidTime(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var description = doc.DocumentNode.SelectNodes("//*[@class='void-time']")[0].InnerText;

        return description;
    }

    private static string BuildKickOffTime(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var description = doc.DocumentNode.SelectNodes("//*[@class='ko-time']")[0].InnerText;

        return description;
    }

    private static string BuildVoidWrongScore(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var description = doc.DocumentNode.SelectNodes("//*[@class='void-wrong-score']")[0].InnerText;

        return description;
    }

    private static string BuildTotalSingleAndParlay(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var totalSingle = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-single']")[0].InnerText;
        var totalParlay = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-parlay']")[0].InnerText;
        var description = $"Single: {totalSingle}, Parlay: {totalParlay}";

        return description;
    }

    private static string BuildVoidTimeAndTotalAccount(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var voidTime = doc.DocumentNode.SelectNodes("//*[@class='void-time']")[0].InnerText;
        var total = doc.DocumentNode.SelectNodes("//*[@class='text-primary total-account']")[0].InnerText;
        var description = voidTime.AppendWithNewLine($"No. of Account: {total}");

        return description;
    }

    public string GetVoidActionName(int id, IEnumerable<VoidAction> voidActions)
    {
        return voidActions.FirstOrDefault(x => x.ActionId == id.ToString())?.ActionName;
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

        return nodes != null && nodes.Any() ? nodes[0].InnerText : string.Empty;
    }

    public string GetEvent(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var nodes = doc.DocumentNode.SelectNodes("//*[@class='match']");

        return nodes != null && nodes.Any() ? nodes[0].InnerText : string.Empty;
    }

    public string GetLeague(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var nodes = doc.DocumentNode.SelectNodes("//*[@class='league text-uppercase']");

        return nodes != null && nodes.Any() ? nodes[0].InnerText : string.Empty;
    }

    public string GetVarCheckValue(bool isCheckedVar)
    {
        return isCheckedVar ? "√" : string.Empty;
    }

    private static string BuildProducts(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var products = doc.DocumentNode.SelectNodes("//*[@class='text-primary product']")[0].InnerText;

        return $"Product: {products}";
    }
}