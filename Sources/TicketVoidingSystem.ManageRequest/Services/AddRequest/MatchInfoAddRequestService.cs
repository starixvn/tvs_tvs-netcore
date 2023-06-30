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

        matchInfo.HomeName = matchInfo.IsNeutral ?
            remotingRefService.GetTeamName(matchInfo.HomeId, LanguageCode.English) + " (N)" : remotingRefService.GetTeamName(matchInfo.HomeId, LanguageCode.English);

        matchInfo.AwayName = remotingRefService.GetTeamName(matchInfo.AwayId, LanguageCode.English);

        matchInfo.MatchEvent = matchInfo.SportType switch
        {
            161 => $"Number Game No.{matchInfo.MatchCode}",
            160 => $"Lucky 3 Game No.{matchInfo.MatchCode}",
            207 => $"{remotingRefService.GetBFName(matchInfo.HomeId)} - vs - {remotingRefService.GetBFName(matchInfo.AwayId)}",
            _ => $"{matchInfo.HomeName} - vs - {matchInfo.AwayName}"
        };

        matchInfo.Name = $"{matchInfo.MatchId} - {matchInfo.MatchEvent}";
        matchInfo.LeagueName = remotingRefService.GetLeagueName(matchInfo.LeagueId, LanguageCode.English);

        return matchInfo;
    }

    public IEnumerable<MatchInfoAddRequest> UpdateDataFromRemotingRef(IEnumerable<MatchInfoAddRequest> matches)
    {
        return matches.Select(UpdateDataFromRemotingRef);
    }
}