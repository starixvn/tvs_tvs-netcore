using System.Text.Json;
using Fanex.Data.Repository;
using Settlement.Business.Core.Models;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface TicketsService
{
    Task<IEnumerable<TicketsBetTransModel>> GetTicketVs2Racing(IEnumerable<BetIdRecover> vs2RacingTickets, IEnumerable<Resources> resources, int siteDbGroupId);

    Task<(RecoverTicketsValidation, IEnumerable<RecoverTicketModel>)> RecoverTicketVs2Racing(IEnumerable<TicketsBetTransModel> tickets, int siteDbGroupId);

    Task<IEnumerable<TicketsBetTransModel>> PrepareTickets(IEnumerable<TicketsBetTransModel> originalTickets, RacingInfoModel racingInfo);
}

public class TicketsServicesImp(IDynamicRepository repository, CalculateService calculateService,
    SessionService sessionService, HistoryDataService historyDataService) : TicketsService
{
    public async Task<IEnumerable<TicketsBetTransModel>> GetTicketVs2Racing(IEnumerable<BetIdRecover> vs2RacingTickets, IEnumerable<Resources> resources, int siteDbGroupId)
    {
        var resourceIds = string.Join(',', resources.Select(x => x.ResourceId).Distinct());
        var ticketsInSiteDb = vs2RacingTickets.Where(x => x.SiteDbGroupId == siteDbGroupId);
        if (!ticketsInSiteDb.Any())
        {
            return await Task.FromResult(Enumerable.Empty<TicketsBetTransModel>());
        }

        var criteria = new GetTicketsVs2RacingCriteria
        {
            Resources = resourceIds,
            TransIds = string.Join(",", vs2RacingTickets.Select(x => x.TransId)),
            SiteDbGroupId = siteDbGroupId
        };

        return await repository.FetchAsync<TicketsBetTransModel>(criteria);
    }

    public async Task<(RecoverTicketsValidation, IEnumerable<RecoverTicketModel>)> RecoverTicketVs2Racing(IEnumerable<TicketsBetTransModel> tickets, int siteDbGroupId)
    {
        var criteria = new RecoverTicketsVs2RacingCriteria
        {
            MatchId = tickets.First().MatchId,
            TransInfoJson = JsonSerializer.Serialize(tickets),
            SiteDbGroupId = siteDbGroupId,
            UserId = sessionService.UserId,
            Ip = sessionService.GetClientIp()
        };

        var recoveredTickets = await repository.FetchAsync<RecoverTicketModel>(criteria);
        var validation = new RecoverTicketsValidation
        {
            ErrorCode = criteria.ErrorCode,
            ErrorMsg = criteria.ErrorMsg,
            NegativeBalanceUsers = criteria.NegativeBalanceUsers
        };

        return (validation, recoveredTickets);
    }

    public async Task<IEnumerable<TicketsBetTransModel>> PrepareTickets(IEnumerable<TicketsBetTransModel> originalTickets, RacingInfoModel racingInfo)
    {
        var runningTickets = ProcessRunningTickets(originalTickets);
        var updatedRefundTickets = ProcessRefundTickets(originalTickets);
        var updatedCalculateTickets = await ProcessSettleTickets(originalTickets, racingInfo);

        return runningTickets.Concat(updatedCalculateTickets).Concat(updatedRefundTickets);
    }

    private List<TicketsBetTransModel> ProcessRunningTickets(IEnumerable<TicketsBetTransModel> tickets)
    {
        var runningTickets = tickets.Where(x => x.Action is null).ToList();

        return runningTickets.Count == 0 ? [] : calculateService.ResetToRunning(runningTickets);
    }

    private async Task<IEnumerable<TicketsBetTransModel>> ProcessSettleTickets(IEnumerable<TicketsBetTransModel> tickets, RacingInfoModel racingInfo)
    {
        var settledTickets = tickets.Where(x => string.Equals(x.Action, SettlementAction.ReCalculate, StringComparison.OrdinalIgnoreCase)).ToList();
        if (settledTickets.Count == 0)
        {
            return [];
        }

        var preparedTickets = calculateService.ResetToRunning(settledTickets);
        var ticketsAfterCalculate = await calculateService.Settle(preparedTickets, racingInfo);
        await historyDataService.Insert(ticketsAfterCalculate);

        return ticketsAfterCalculate;
    }

    public IEnumerable<TicketsBetTransModel> ProcessRefundTickets(IEnumerable<TicketsBetTransModel> tickets)
    {
        var refundTickets = tickets.Where(x => string.Equals(x.Action, SettlementAction.Refund, StringComparison.OrdinalIgnoreCase)).ToList();
        if (refundTickets.Count == 0)
        {
            return [];
        }

        var preparedTickets = calculateService.ResetToRunning(refundTickets);
        return calculateService.Refund(preparedTickets);
    }
}