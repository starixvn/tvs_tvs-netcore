using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface DescriptionService
{
    string Build(RequestDescription item);
}

public class DescriptionServiceImp(DescriptionElementService elementService) : DescriptionService
{
    public string Build(RequestDescription item)
    {
        var matchingFunctions = new Dictionary<int, Func<RequestDescription, string>>
            {
                {IssueTypeConstant.AbnormalBet, BuildAbnormalBet},
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
                {IssueTypeConstant.Abandoned, BuildMatchLeague},
                {IssueTypeConstant.WrongScore, BuildWrongScore},
                {IssueTypeConstant.ArchivedTicket, BuildVoidArchivedTicket},
                {IssueTypeConstant.AbnormalAccount, BuildAbnormalAccount},
                {IssueTypeConstant.DuplicateTickets, BuildDuplicateTickets},
                {IssueTypeConstant.NotParticipate, BuildMatchLeague},
                {IssueTypeConstant.RecoverTicket, BuildProducts},
                {IssueTypeConstant.WrongMarketOffered, BuildMatchLeague},
                {IssueTypeConstant.TechnicalError, BuildMatchLeague},
                {IssueTypeConstant.WrongOddsSportsBook, BuildVoidTimeMatchLeague},
                {IssueTypeConstant.WrongOfferedName, BuildMatchLeague},
                {IssueTypeConstant.OtherIssues, BuildMatchLeague}
            };

        matchingFunctions.TryGetValue(item.IssueTypeId, out var function);
        return function != null ? function.Invoke(item) : BuildDefault(item);
    }

    private string BuildAbnormalBet(RequestDescription item)
    {
        return item.FilterBy switch
        {
            FilterByConstant.MixParlay => elementService.BuildMixParlay(item.TotalSingle),
            FilterByConstant.SystemParlay => elementService.BuildSystemParlay(item.TotalSingle),
            _ => BuildMatchLeagueTotal(item)
        };
    }

    private string BuildDuplicateTickets(RequestDescription item)
    {
        return item.FilterBy == FilterByConstant.MixParlay
            ? elementService.BuildParlay(item.TotalSingle)
            : BuildMatchLeagueTotal(item);
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
        return elementService.BuildTotal(item.TotalSingle, item.TotalParlay, []);
    }

    private string BuildProducts(RequestDescription item)
    {
        var products = elementService.BuildProducts(item.Products);

        return $"{products}";
    }
}