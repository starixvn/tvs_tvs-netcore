using Fanex.BetList.Core.Entities;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.ViewModels.BetTypes;
using Match = TicketVoidingSystem.Models.Match;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface CopyRequestInfoService
{
    Task<(RequestInfoForCopy, IEnumerable<BetTypeTicketsInfo>)> GetCopyInfo(int matchId, int requestId, int? requestDetailId);

    void UpdateMatchInfo(int matchId, RequestInfoForCopy requestInfo);

    void UpdateBetTypeName(IEnumerable<BetTypeTicketsInfo> betTypeTickets);

    Task UpdatePlayerNameForBetTypeNextManOut(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets);
}

public class CopyRequestInfoServiceImp(
    IDynamicRepository repository,
    MatchService matchService,
    BetListService betListService,
    RequestExtraInfoXmlService requestExtraInfoXmlService)
    : CopyRequestInfoService
{
    public async Task<(RequestInfoForCopy, IEnumerable<BetTypeTicketsInfo>)> GetCopyInfo(int matchId, int requestId, int? requestDetailId)
    {
        var criteria = new CopyRequestInfoCriteria
        {
            MatchId = matchId,
            RequestId = requestId,
            RequestDetailId = requestDetailId
        };

        var (requestInfos, betTypeTickets) = await repository.FetchMultipleAsync<RequestInfoForCopy, BetTypeTicketsInfo>(criteria);
        if (!requestInfos.Any())
        {
            return (null, null);
        }

        var firstRequest = requestInfos.First();
        firstRequest.Operators = requestExtraInfoXmlService.ParseXmlToOperators(firstRequest.OperatorInfo);
        requestExtraInfoXmlService.UpdateRequestInfoForCopy(firstRequest.IssueTypeId, firstRequest);

        return (firstRequest, betTypeTickets);
    }

    public void UpdateMatchInfo(int matchId, RequestInfoForCopy requestInfo)
    {
        var match = new Match
        {
            MatchId = matchId,
            HomeId = requestInfo.HomeId,
            AwayId = requestInfo.AwayId,
            LeagueId = requestInfo.LeagueId,
            IsNeutral = requestInfo.IsNeutral,
            SportType = requestInfo.SportType
        };
        matchService.UpdateMatchInfoFromRemotingRef(match);

        requestInfo.MatchEvent = match.MatchEvent;
        requestInfo.LeagueName = match.LeagueName;
        requestInfo.HomeName = match.HomeName;
        requestInfo.AwayName = match.AwayName;
    }

    public void UpdateBetTypeName(IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        foreach (var betType in betTypeTickets)
        {
            var ticket = new Ticket
            {
                BetId = betType.BetId,
                BetTypeId = betType.BetTypeId
            };

            betType.BetTypeName = betListService.GetBetTypeName(ticket);
        }
    }

    public async Task UpdatePlayerNameForBetTypeNextManOut(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        var betTypesHavePlayerOdds = betTypeTickets.Where(x => !string.IsNullOrWhiteSpace(x.PlayerAndOdds)).ToList();
        var oddsInfo = await GetOddsInfo(matchId, betTypesHavePlayerOdds);
        var groupByOddsId = oddsInfo.GroupBy(x => x.OddsId)
            .ToDictionary(x => x.Key, x => x.ToList());

        foreach (var betType in betTypesHavePlayerOdds)
        {
            var playerAndOdds = betType.PlayerAndOdds.Split("$");
            var betChoice = playerAndOdds[0];
            var oddsId = playerAndOdds[1];
            var currentPlayer = groupByOddsId[oddsId].First(x => x.BetChoice == betChoice);
            var comboPlayersText = string.Join(" & ", groupByOddsId[oddsId].Select(x => x.PlayerName));

            betType.PlayerName = $"{currentPlayer.PlayerName} - {comboPlayersText}";
        }
    }

    private async Task<IEnumerable<OddsInfoViewModel>> GetOddsInfo(int matchId, IEnumerable<BetTypeTicketsInfo> betTypesHavePlayerOdds)
    {
        var betTypeIds = string.Join(",", betTypesHavePlayerOdds.Select(x => x.BetTypeId));
        var criteria = new GetOddsInfoCriteria
        {
            MatchId = matchId,
            BetTypes = betTypeIds
        };
        return await repository.FetchAsync<OddsInfoViewModel>(criteria);
    }
}