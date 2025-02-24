using AutoMapper;
using Settlement.Business.Core.Models;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using TicketVoidingSystem.Services;
using SettlementMatchService = Settlement.Business.Services.MatchService;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface RecoverRacingService
{
    Task<RecoverTicketsModel> Execute(IEnumerable<BetIdRecover> vs2RacingBetIds);
}

public class RecoverRacingServiceImp(TicketsService ticketsService, SettlementMatchService settlementMatchService,
    MatchService matchService, Repository repository, IMapper mapper) : RecoverRacingService
{
    public async Task<RecoverTicketsModel> Execute(IEnumerable<BetIdRecover> vs2RacingBetIds)
    {
        var (_, outright, resources) = await settlementMatchService.GetRacingInfo(1);
        var tickets = await ticketsService.GetTicketVs2Racing(vs2RacingBetIds, resources);
        var results = await ProcessRecover(tickets, outright, resources);

        return CombineResults(results);
    }

    public async Task<(RecoverTicketsValidation, IEnumerable<RecoverTicketModel>)> ExecuteOneByOne(
        IGrouping<KeyGroupTicket, TicketsBetTransModel> group, IEnumerable<Outright> outright, IEnumerable<Resources> resources)
    {
        try
        {
            var validation = mapper.Map<RecoverTicketsValidation>(await matchService.LockMatch(group.Key.MatchId, 1, group.Key.SiteDbGroupId));
            if (validation.IsSuccessful)
            {
                //prepare tickets
                var preparedTickets = await ticketsService.PrepareTickets(group, outright, resources);

                // call SP update recover
                var result = await ticketsService.RecoverTicketVs2Racing(preparedTickets, group.Key.SiteDbGroupId);
                validation.ErrorCode = result.Item1.ErrorCode;
                validation.ErrorMsg = result.Item1.ErrorMsg;
                validation.NegativeBalanceUsers = result.Item1.NegativeBalanceUsers;

                //unlock
                await matchService.LockMatch(group.Key.MatchId, 0, group.Key.SiteDbGroupId);
                return (validation, result.Item2);
            }

            return (validation, []);
        }
        catch (Exception exception)
        {
            //unlock
            var errorMessage = $"matchId = {group.Key.MatchId} - SiteDbGroupId = {group.Key.SiteDbGroupId} - {exception.Message}";
            await matchService.LockMatch(group.Key.MatchId, 0, 1);

            var validation = new RecoverTicketsValidation
            {
                ErrorCode = 1,
                ErrorMsg = errorMessage
            };

            return (validation, []);
        }
    }

    private async Task<(RecoverTicketsValidation, IEnumerable<RecoverTicketModel>)[]> ProcessRecover(
        IEnumerable<TicketsBetTransModel> tickets, IEnumerable<Outright> outright, IEnumerable<Resources> resources)
    {
        var groupTickets = tickets.GroupBy(t => new KeyGroupTicket { MatchId = t.MatchId, SiteDbGroupId = t.SiteDBGroupId });
        var tasks = groupTickets.Select(group => ExecuteOneByOne(group, outright, resources));
        var results = await Task.WhenAll(tasks);

        return results;
    }

    private RecoverTicketsModel CombineResults((RecoverTicketsValidation, IEnumerable<RecoverTicketModel>)[] results)
    {
        var validations = results.Select(x => x.Item1);
        var tickets = results.Select(x => x.Item2).SelectMany(x => x);

        return repository.BuildResultRecoverTickets(validations, tickets);
    }
}