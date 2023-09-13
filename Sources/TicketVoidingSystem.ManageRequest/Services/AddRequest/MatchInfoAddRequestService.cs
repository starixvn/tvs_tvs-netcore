using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface MatchInfoAddRequestService
{
    IEnumerable<MatchInfoAddRequest> UpdateDataFromRemotingRef(IEnumerable<MatchInfoAddRequest> matches);

    MatchInfoAddRequest UpdateDataFromRemotingRef(MatchInfoAddRequest? matchInfo);
}

public class MatchInfoAddRequestServiceImp : MatchInfoAddRequestService
{
    private readonly RemotingRefWrapperService remotingRefService;

    public MatchInfoAddRequestServiceImp(RemotingRefWrapperService remotingRefService)
    {
        this.remotingRefService = remotingRefService;
    }

    public MatchInfoAddRequest UpdateDataFromRemotingRef(MatchInfoAddRequest? matchInfo)
    {
        if (matchInfo == null)
        {
            return null;
        }

        matchInfo.LeagueName = remotingRefService.GetLeagueName(matchInfo.LeagueId, LanguageCode.English);
        matchInfo.HomeName = matchInfo.IsNeutral ?
            remotingRefService.GetTeamName(matchInfo.HomeId, LanguageCode.English) + " (N)" : remotingRefService.GetTeamName(matchInfo.HomeId, LanguageCode.English);
        matchInfo.AwayName = remotingRefService.GetTeamName(matchInfo.AwayId, LanguageCode.English);
        matchInfo.MatchEvent = GetMatchEvent(matchInfo);
        matchInfo.Name = $"{matchInfo.MatchId} - {matchInfo.MatchEvent}";

        return matchInfo;
    }

    public IEnumerable<MatchInfoAddRequest> UpdateDataFromRemotingRef(IEnumerable<MatchInfoAddRequest> matches)
    {
        return matches.Select(UpdateDataFromRemotingRef);
    }

    private string GetMatchEvent(MatchInfoAddRequest match)
    {
        return match.SportType switch
        {
            SportTypeConstant.Lucky3Game => $"Lucky 3 Game No.{match.MatchCode}",
            SportTypeConstant.NumberGame => $"Number Game No.{match.MatchCode}",
            SportTypeConstant.Happy5 => $"Happy 5 No.{match.MatchCode}",
            SportTypeConstant.Bullfighting => $"{remotingRefService.GetBFName(match.HomeId)} - vs - {remotingRefService.GetBFName(match.AwayId)}",
            _ => match.IsOutright ? $"{match.HomeName} - {match.LeagueName}" : $"{match.HomeName} - vs - {match.AwayName}"
        };
    }
}