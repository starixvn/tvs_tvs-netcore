using System;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Polly;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.ViewModels;

namespace TicketVoidingSystem.Services;

public interface MatchService
{
    Task<MatchInfoAddRequestViewModel> GetMatchAddRequest(GetMatchInfoAddRequestCriteria criteria);

    Task<Match> GetMatch(GetMatchInfoCriteria criteria);

    Task<Match> GetMatch(int matchId);

    Task<Match> GetMatchVoidByCurrency(GetMatchInfoVoidByCurrencyCriteria criteria);

    Task<Match> GetMatchVoidByCurrency(int matchId);

    Match UpdateMatchInfoFromRemotingRef(Match match);

    string GetMatchEvent(Match match);

    Task<Result> LockMatch(int matchId, int type, byte lockStatus, int siteDbGroupId);
}

public class MatchServiceImp(IDynamicRepository repository, RemotingRefWrapperService remotingRefWrapperService)
    : MatchService
{
    private const int SportType160 = 160;
    private const int SportType161 = 161;
    private const int SportType164 = 164;
    private const int SportType207 = 207;

    public async Task<MatchInfoAddRequestViewModel> GetMatchAddRequest(GetMatchInfoAddRequestCriteria criteria)
    {
        var match = await repository.GetAsync<Match>(criteria);

        return new MatchInfoAddRequestViewModel
        {
            Match = match,
            ErrorCode = criteria.ErrorCode,
            ErrorMsg = criteria.ErrorMsg
        };
    }

    public async Task<Match> GetMatch(GetMatchInfoCriteria criteria)
    {
        return await repository.GetAsync<Match>(criteria);
    }

    public async Task<Match> GetMatch(int matchId)
    {
        return await GetMatch(new GetMatchInfoCriteria { MatchId = matchId });
    }

    public async Task<Match> GetMatchVoidByCurrency(GetMatchInfoVoidByCurrencyCriteria criteria)
    {
        return await repository.GetAsync<Match>(criteria);
    }

    public async Task<Match> GetMatchVoidByCurrency(int matchId)
    {
        return await GetMatchVoidByCurrency(new GetMatchInfoVoidByCurrencyCriteria { MatchId = matchId });
    }

    public Match UpdateMatchInfoFromRemotingRef(Match match)
    {
        if (match == null)
        {
            return null;
        }

        match.HomeName = match.IsNeutral
            ? remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.English) + " (N)"
            : remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.English);

        match.HomeNameSimplified = match.IsNeutral
            ? remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.ChineseSimplified) + " (中)"
            : remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.ChineseSimplified);

        match.HomeNameNewSimplified = match.IsNeutral
            ? remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.NewChineseSimplified) + " (中)"
            : remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.NewChineseSimplified);

        match.HomeNameTraditional = match.IsNeutral
            ? remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.ChineseTraditional) + " (中)"
            : remotingRefWrapperService.GetTeamName(match.SportType, match.HomeId, LanguageCode.ChineseTraditional);

        match.AwayName = remotingRefWrapperService.GetTeamName(match.SportType, match.AwayId, LanguageCode.English);
        match.AwayNameSimplified = remotingRefWrapperService.GetTeamName(match.SportType, match.AwayId, LanguageCode.ChineseSimplified);
        match.AwayNameNewSimplified = remotingRefWrapperService.GetTeamName(match.SportType, match.AwayId, LanguageCode.NewChineseSimplified);
        match.AwayNameTraditional = remotingRefWrapperService.GetTeamName(match.SportType, match.AwayId, LanguageCode.ChineseTraditional);
        match.LeagueName = remotingRefWrapperService.GetLeagueName(match.SportType, match.LeagueId, LanguageCode.English);
        match.LeagueNameSimplified = remotingRefWrapperService.GetLeagueName(match.SportType, match.LeagueId, LanguageCode.ChineseSimplified);
        match.LeagueNameNewSimplified = remotingRefWrapperService.GetLeagueName(match.SportType, match.LeagueId, LanguageCode.NewChineseSimplified);
        match.LeagueNameTraditional = remotingRefWrapperService.GetLeagueName(match.SportType, match.LeagueId, LanguageCode.ChineseTraditional);
        match.MatchEvent = GetMatchEvent(match);
        match.MatchEventSimplified = GetMatchEventSimplified(match.SportType, match.IsOutright, match.HomeNameSimplified, match.AwayNameSimplified, match.LeagueNameSimplified);
        match.MatchEventNewSimplified = GetMatchEventNewSimplified(match.SportType, match.IsOutright, match.HomeNameNewSimplified, match.AwayNameNewSimplified, match.LeagueNameNewSimplified);
        match.SportTypeName = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.English);
        match.SportTypeNameSimplified = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.ChineseSimplified);
        match.SportTypeNameNewSimplified = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.NewChineseSimplified);
        match.SportTypeNameTraditional = remotingRefWrapperService.GetSportName(match.SportType.ToString(), LanguageCode.ChineseTraditional);
        match.Name = $"{match.MatchId} - {match.MatchEvent}";
        match.OriginLeagueName = match.LeagueName;
        match.OriginLeagueNameSimplified = match.LeagueNameSimplified;
        match.OriginLeagueNameNewSimplified = match.LeagueNameNewSimplified;
        match.OriginLeagueNameTraditional = match.LeagueNameTraditional;
        return match;
    }

    public string GetMatchEvent(Match match)
    {
        if (match.SportType.IsRacingVirtualSports())
        {
            return $"Event {match.VendorMatchId} - ID {match.RaceId}";
        }

        return match.SportType switch
        {
            SportType160 => $"Lucky 3 Game No.{match.MatchCode}",
            SportType161 => StringResource.NumberGameNo + match.MatchCode,
            SportType164 => $"Happy 5 No .{match.MatchCode}",
            SportType207 => $"{remotingRefWrapperService.GetBFName(match.HomeId)} - vs - {remotingRefWrapperService.GetBFName(match.AwayId)}",
            _ => match.IsOutright ? $"{match.HomeName} - {match.LeagueName}" : $"{match.HomeName} - vs - {match.AwayName}"
        };
    }

    private static string GetMatchEventSimplified(int sportType, bool isOutright, string homeNameSimplified, string awayNameSimplified, string leagueNameSimplified)
    {
        if (sportType is SportType160 or SportType161 or SportType207)
        {
            return string.Empty;
        }

        return isOutright ? $"{homeNameSimplified} - {leagueNameSimplified}" : $"{homeNameSimplified} - vs - {awayNameSimplified}";
    }

    private static string GetMatchEventNewSimplified(int sportType, bool isOutright, string homeNameNewSimplified, string awayNameNewSimplified, string leagueNameNewSimplified)
    {
        if (sportType is SportType160 or SportType161 or SportType207)
        {
            return string.Empty;
        }

        return isOutright ? $"{homeNameNewSimplified} - {leagueNameNewSimplified}" : $"{homeNameNewSimplified} - vs - {awayNameNewSimplified}";
    }

    public async Task<Result> LockMatch(int matchId, int type, byte lockStatus, int siteDbGroupId)
    {
        const byte retryCount = 2;
        const byte retryTimes = 2;
        var result = new Result();
        await Policy
            .HandleResult<bool>(c => !c && lockStatus == 1)
            .WaitAndRetryAsync(retryCount,
                _ => TimeSpan.FromSeconds(retryTimes))
            .ExecuteAsync(async () =>
            {
                result = await repository.GetAsync<Result>(new LockMatchCriteria
                { MatchId = matchId, Lock = lockStatus, SiteDbGroupId = siteDbGroupId, Type = type });
                return result.IsSuccessful;
            });

        return result;
    }
}