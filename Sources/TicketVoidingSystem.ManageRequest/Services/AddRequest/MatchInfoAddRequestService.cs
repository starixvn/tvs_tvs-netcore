using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface MatchInfoAddRequestService
{
    IEnumerable<MatchInfoAddRequest> UpdateDataFromRemotingRef(IEnumerable<MatchInfoAddRequest> matches);

    MatchInfoAddRequest UpdateDataFromRemotingRef(MatchInfoAddRequest? matchInfo);
}

public class MatchInfoAddRequestServiceImp(RemotingRefWrapperService remotingRefWrapperService)
    : MatchInfoAddRequestService
{
    public MatchInfoAddRequest UpdateDataFromRemotingRef(MatchInfoAddRequest? matchInfo)
    {
        if (matchInfo == null)
        {
            return null;
        }

        matchInfo.LeagueName = remotingRefWrapperService.GetLeagueName(matchInfo.SportType, matchInfo.LeagueId, LanguageCode.English);
        matchInfo.HomeName = matchInfo.IsNeutral
            ? remotingRefWrapperService.GetTeamName(matchInfo.SportType, matchInfo.HomeId, LanguageCode.English) + " (N)"
            : remotingRefWrapperService.GetTeamName(matchInfo.SportType, matchInfo.HomeId, LanguageCode.English);
        matchInfo.AwayName = remotingRefWrapperService.GetTeamName(matchInfo.SportType, matchInfo.AwayId, LanguageCode.English);
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
        if (match.SportType.IsRacingVirtualSports())
        {
            return $"Event {match.VendorMatchId} - ID {match.RaceId}";
        }

        return match.SportType switch
        {
            SportTypeConstant.Lucky3Game => $"Lucky 3 Game No.{match.MatchCode}",
            SportTypeConstant.NumberGame => $"Number Game No.{match.MatchCode}",
            SportTypeConstant.Happy5 => $"Happy 5 No.{match.MatchCode}",
            SportTypeConstant.Bullfighting => $"{remotingRefWrapperService.GetBFName(match.HomeId)} - vs - {remotingRefWrapperService.GetBFName(match.AwayId)}",
            _ => match.IsOutright ? $"{match.HomeName} - {match.LeagueName}" : $"{match.HomeName} - vs - {match.AwayName}"
        };
    }
}