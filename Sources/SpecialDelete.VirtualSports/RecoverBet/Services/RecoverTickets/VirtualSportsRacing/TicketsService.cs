using System.Text.Json;
using Fanex.Data.Repository;
using Settlement.Business.Core.Models;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface TicketsService
{
    Task<IEnumerable<TicketsBetTransModel>> GetTicketVs2Racing(IEnumerable<BetIdRecover> vs2RacingTickets, IEnumerable<Resources> resources, int siteDbGroupId);

    Task<(RecoverTicketsValidation, IEnumerable<RecoverTicketModel>)> RecoverTicketVs2Racing(IEnumerable<TicketsBetTransModel> tickets, int siteDbGroupId);

    Task<IEnumerable<TicketsBetTransModel>> PrepareTickets(IEnumerable<TicketsBetTransModel> originalTickets, IEnumerable<Outright> outright, IEnumerable<Resources> resources);
}

public class TicketsServicesImp(IDynamicRepository repository, CalculateService calculateService) : TicketsService
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
            TransInfoJson = JsonSerializer.Serialize(tickets),
            SiteDbGroupId = siteDbGroupId
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

    public async Task<IEnumerable<TicketsBetTransModel>> PrepareTickets(IEnumerable<TicketsBetTransModel> originalTickets, IEnumerable<Outright> outright, IEnumerable<Resources> resources)
    {
        var runningTickets = originalTickets.Where(x => x.Status.IsRunning());
        var updatedCalculateTickets = await ProcessSettleTickets(originalTickets, outright, resources);
        var updatedRefundTickets = ProcessRefundTickets(originalTickets);

        return runningTickets.Concat(updatedCalculateTickets).Concat(updatedRefundTickets);
    }

    private async Task<IEnumerable<TicketsBetTransModel>> ProcessSettleTickets(IEnumerable<TicketsBetTransModel> tickets, IEnumerable<Outright> outright, IEnumerable<Resources> resources)
    {
        var settledTickets = tickets.Where(x => x.Status.IsSettled()).ToList();
        if (settledTickets.Count == 0)
        {
            return [];
        }

        var preparedTickets = calculateService.ResetToRunning(settledTickets);
        return await calculateService.Settle(preparedTickets, outright.ToList(), resources.ToList());
    }

    public IEnumerable<TicketsBetTransModel> ProcessRefundTickets(IEnumerable<TicketsBetTransModel> tickets)
    {
        var refundTickets = tickets.Where(x => x.Status.IsRefund()).ToList();
        if (refundTickets.Count == 0)
        {
            return [];
        }

        var preparedTickets = calculateService.ResetToRunning(refundTickets);
        return calculateService.Refund(preparedTickets);
    }
}