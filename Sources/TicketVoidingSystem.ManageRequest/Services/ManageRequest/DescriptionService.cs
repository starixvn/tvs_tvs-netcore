using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface DescriptionService
{
    string Build(RequestDescription item);
}

public class DescriptionServiceImp : DescriptionService
{
    private const int AB_PARLAY = 1;
    private readonly DescriptionElementService elementService;

    public DescriptionServiceImp(
        DescriptionElementService elementService)
    {
        this.elementService = elementService;
    }

    public string Build(RequestDescription item)
    {
        var matchingFunctions = new Dictionary<int, Func<RequestDescription, string>>
            {
                {IssueTypeConstant.AbnormalBet, BuildSingleOrMixParlay},
                {IssueTypeConstant.AbnormalBetRealMember, BuildMatchLeagueTotal},
                {IssueTypeConstant.EarlyKickOffTime, BuildEKO},
                {IssueTypeConstant.WrongKickOffTime, BuildEKO},
                {IssueTypeConstant.DangerAccepted, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.RedCard, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.WrongHDP, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.Wrong1stHDP, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.WrongOU, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.Wrong1stOU, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.WrongOdds, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.ReducedOver, BuildMatchLeague},
                {IssueTypeConstant.WrongScore, BuildWrongScore},
                {IssueTypeConstant.ArchivedTicket, BuildVoidArchivedTicket},
                {IssueTypeConstant.AbnormalAccount, BuildAbnormalAccount},
                {IssueTypeConstant.DuplicateTickets, BuildSingleOrParlay},
                {IssueTypeConstant.NotParticipate, BuildMatchLeague},
                {IssueTypeConstant.RecoverTicket, BuildProducts}
            };

        matchingFunctions.TryGetValue(item.IssueTypeId, out var function);
        return function != null ? function.Invoke(item) : BuildDefault(item);
    }

    private string BuildSingleOrMixParlay(RequestDescription item)
    {
        return item.FilterBy == AB_PARLAY ? elementService.BuildMixParlay(item.TotalSingle) : BuildMatchLeagueTotal(item);
    }

    private string BuildSingleOrParlay(RequestDescription item)
    {
        return item.FilterBy == AB_PARLAY ? elementService.BuildParlay(item.TotalSingle) : BuildMatchLeagueTotal(item);
    }

    private string BuildEKO(RequestDescription item)
    {
        var koTime = elementService.BuildKoTime(item.KickOffTime);
        var match = elementService.BuildMatch(item.MatchEvent);
        var league = elementService.BuildLeague(item.SportTypeName, item.LeagueName);
        return $"{koTime}{match}{league}";
    }

    private string BuildDefault(RequestDescription item)
    {
        var logID = elementService.BuildLogId(item.FromLogId, item.ToLogId);
        var match = elementService.BuildMatch(item.MatchEvent);
        var league = elementService.BuildLeague(item.SportTypeName, item.LeagueName);
        var total = elementService.BuildTotal(item.TotalSingle, item.TotalParlay, item.BettypeNames);
        return $"{logID}{match}{league}{total}";
    }

    private string BuildMatchLeagueTotal(RequestDescription item)
    {
        var match = elementService.BuildMatch(item.MatchEvent);
        var league = elementService.BuildLeague(item.SportTypeName, item.LeagueName);
        var total = elementService.BuildTotal(item.TotalSingle, null, item.BettypeNames);

        return $"{match}{league}{total}";
    }

    private string BuildMatchLeague(RequestDescription item)
    {
        var match = elementService.BuildMatch(item.MatchEvent);
        var league = elementService.BuildLeague(item.SportTypeName, item.LeagueName);

        return $"{match}{league}";
    }

    private string BuildVoidTimeMatchLeague(RequestDescription item)
    {
        var voidTime = elementService.BuildVoidTime(item.FilterBy, item.VoidFromTime, item.VoidToTime);
        var match = elementService.BuildWithVarCheck(item.MatchEvent, item.IsCheckedVar);
        var league = elementService.BuildLeague(item.SportTypeName, item.LeagueName);

        return $"{voidTime}{match}{league}";
    }

    private string BuildAbnormalAccount(RequestDescription item)
    {
        var voidTime = elementService.BuildVoidTimeAbnormalAccount(item.FromWinlostDate, item.ToWinlostDate);
        var noOfAccount = elementService.BuildNoOfAccount(item.TotalUserName);

        return $"{voidTime}{noOfAccount}";
    }

    private string BuildWrongScore(RequestDescription item)
    {
        var voidTime = elementService.BuildWrongScores(item.FilterBy.Value, item.WrongScores);
        var match = elementService.BuildWithVarCheck(item.MatchEvent, item.IsCheckedVar);
        var league = elementService.BuildLeague(item.SportTypeName, item.LeagueName);

        return $"{voidTime}{match}{league}";
    }

    private string BuildVoidArchivedTicket(RequestDescription item)
    {
        return elementService.BuildTotal(item.TotalSingle, item.TotalParlay, Enumerable.Empty<string>());
    }

    private string BuildProducts(RequestDescription item)
    {
        var products = elementService.BuildProducts(item.Products);

        return $"{products}";
    }
}