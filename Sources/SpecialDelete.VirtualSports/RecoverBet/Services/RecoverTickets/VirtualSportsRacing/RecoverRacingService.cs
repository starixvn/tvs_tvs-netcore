using AutoMapper;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using TicketVoidingSystem.Constants;
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
        var groupTickets = vs2RacingBetIds.GroupBy(t => new KeyGroupTicket(t.MatchId, t.SiteDbGroupId));
        var tasks = groupTickets.Select(ExecuteOneByOne);
        var results = await Task.WhenAll(tasks);

        return results;
    }

    private async Task<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)> ExecuteOneByOne(IGrouping<KeyGroupTicket, BetIdRecover> group)
    {
        try
        {
            var (outright, resources) = await repository.GetRacingInfo(group.Key.MatchId);
            var ticketsAfterValidation = await ticketsService.GetTicketVs2Racing(group, resources, group.Key.SiteDbGroupId);
            var preparedTickets = await ticketsService.PrepareTickets(ticketsAfterValidation, outright, resources);
            var completedMatchIds = GetCompletedMatches(ticketsAfterValidation);
            var lockMatchResult = await matchService.LockMatch(group.Key.MatchId, LockMatchType.VirtualRacing, LockMatchStatus.Lock, group.Key.SiteDbGroupId);
            var validation = mapper.Map<RecoverTicketsValidation>(lockMatchResult);
            if (validation.IsSuccessful)
            {
                (RecoverTicketsValidation Validation, IEnumerable<RecoverTicketModel> Tickets) result
                    = await ticketsService.RecoverTicketVs2Racing(preparedTickets, group.Key.SiteDbGroupId);
                validation.ErrorCode = result.Validation.ErrorCode;
                validation.ErrorMsg = result.Validation.ErrorMsg;
                validation.CompletedMatchIds = string.Join(",", completedMatchIds);
                validation.NegativeBalanceUsers = result.Item1.NegativeBalanceUsers;

                await matchService.LockMatch(group.Key.MatchId, LockMatchType.VirtualRacing, LockMatchStatus.UnLock, group.Key.SiteDbGroupId);
                return ([validation], result.Tickets);
            }

            return ([validation], []);
        }
        catch (Exception exception)
        {
            var errorMessage = $"MatchId = {group.Key.MatchId} - SiteDbGroupId = {group.Key.SiteDbGroupId} - {exception.Message}";
            await matchService.LockMatch(group.Key.MatchId, LockMatchType.VirtualRacing, LockMatchStatus.UnLock, group.Key.SiteDbGroupId);
            var validation = new RecoverTicketsValidation
            {
                ErrorCode = 1,
                ErrorMsg = errorMessage
            };

            return ([validation], []);
        }
    }

    private static IEnumerable<int> GetCompletedMatches(IEnumerable<TicketsBetTransModel> ticketsAfterValidation)
    {
        return ticketsAfterValidation.Where(x =>
                string.Equals(x.Action, SettlementAction.ReCalculate, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(x.Action, SettlementAction.Refund, StringComparison.OrdinalIgnoreCase))
            .Select(x => x.MatchId);
    }
}