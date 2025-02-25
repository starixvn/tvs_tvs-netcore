using AutoMapper;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface RecoverRacingService
{
    Task<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)[]> Execute(IEnumerable<BetIdRecover> vs2RacingBetIds);
}

public class RecoverRacingServiceImp(TicketsService ticketsService, Repository repository,
    MatchService matchService, IMapper mapper) : RecoverRacingService
{
    public async Task<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)[]> Execute(IEnumerable<BetIdRecover> vs2RacingBetIds)
    {
        var groupTickets = vs2RacingBetIds.GroupBy(t => new KeyGroupTicket { MatchId = t.MatchId, SiteDbGroupId = t.SiteDbGroupId });
        var tasks = groupTickets.Select(ExecuteOneByOne);
        var results = await Task.WhenAll(tasks);

        return results;
    }

    public async Task<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)> ExecuteOneByOne(IGrouping<KeyGroupTicket, BetIdRecover> group)
    {
        try
        {
            var (outright, resources) = await repository.GetRacingInfo(group.Key.MatchId);
            var ticketsAfterValidation = await ticketsService.GetTicketVs2Racing(group, resources, group.Key.SiteDbGroupId);
            var preparedTickets = await ticketsService.PrepareTickets(ticketsAfterValidation, outright, resources);

            var validation = mapper.Map<RecoverTicketsValidation>(await matchService.LockMatch(group.Key.MatchId, 1, group.Key.SiteDbGroupId));
            if (validation.IsSuccessful)
            {
                var result = await ticketsService.RecoverTicketVs2Racing(preparedTickets, group.Key.SiteDbGroupId);
                validation.ErrorCode = result.Item1.ErrorCode;
                validation.ErrorMsg = result.Item1.ErrorMsg;
                validation.NegativeBalanceUsers = result.Item1.NegativeBalanceUsers;

                await matchService.LockMatch(group.Key.MatchId, 0, group.Key.SiteDbGroupId);
                return ([validation], result.Item2);
            }

            return ([validation], []);
        }
        catch (Exception exception)
        {
            var errorMessage = $"matchId = {group.Key.MatchId} - SiteDbGroupId = {group.Key.SiteDbGroupId} - {exception.Message}";
            await matchService.LockMatch(group.Key.MatchId, 0, 1);
            var validation = new RecoverTicketsValidation
            {
                ErrorCode = 1,
                ErrorMsg = errorMessage
            };

            return ([validation], []);
        }
    }
}