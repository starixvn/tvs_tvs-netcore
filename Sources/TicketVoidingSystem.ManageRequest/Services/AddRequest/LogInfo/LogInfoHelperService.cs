using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;

public interface LogInfoHelperService
{
    Task<IEnumerable<string>> GetTransInfoJson(GetLogInfoQuery query);

    Task UpdateBetTypeTicketsInfo(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets);
}

public class LogInfoHelperServiceImp : LogInfoHelperService
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly BetListService betListService;
    private readonly CopyRequestInfoService copyRequestInfoService;

    public LogInfoHelperServiceImp(GetTransInfoService getTransInfoService, BetListService betListService, CopyRequestInfoService copyRequestInfoService)
    {
        this.getTransInfoService = getTransInfoService;
        this.betListService = betListService;
        this.copyRequestInfoService = copyRequestInfoService;
    }

    public async Task<IEnumerable<string>> GetTransInfoJson(GetLogInfoQuery query)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            WrongScoreModels = query.WrongScoreModels,
            RedCardModels = query.RedCardModels,
            DangerAcceptedModels = query.DangerAcceptedModels,
            WrongHdpModels = query.WrongHdpModels,
            Wrong1stHdpModels = query.Wrong1stHdpModels,
            WrongOuModels = query.WrongOuModels,
            Wrong1stOuModels = query.Wrong1stOuModels,
            WrongOddsModels = query.WrongOddsModels,
            ReducedOverModels = query.ReducedOverModels,
            NotParticipateModels = query.NotParticipateModels,
            EarlyKickOffModels = query.EarlyKickOffModels,
            WrongMarketOfferedModel = query.WrongMarketOfferedModel,
            MatchId = query.MatchId,
            IssueTypeId = query.IssueTypeId
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }

    public async Task UpdateBetTypeTicketsInfo(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        UpdateBetTypeName(betTypeTickets);
        await UpdatePlayerNameForBetTypeNextManOut(matchId, betTypeTickets);
    }

    private void UpdateBetTypeName(IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        foreach (var item in betTypeTickets)
        {
            item.BetTypeName = betListService.GetBetTypeName(new Ticket
            {
                BetTypeId = item.BetTypeId,
                BetId = item.BetId,
            });
        }
    }

    private async Task UpdatePlayerNameForBetTypeNextManOut(int matchId, IEnumerable<BetTypeTicketsInfo> betTypeTickets)
    {
        await copyRequestInfoService.UpdatePlayerNameForBetTypeNextManOut(matchId, betTypeTickets);
    }
}