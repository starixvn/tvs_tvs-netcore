using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface ProcessRecoverService
{
    Task<RecoverTicketsModel> Execute(Query query);
}

public class ProcessRecoverServiceImp(
    Repository repository,
    LoggingService loggingService,
    MatchService matchService) : ProcessRecoverService
{
    public async Task<RecoverTicketsModel> Execute(Query query)
    {
        var racingSportTickets = query.Tickets.Where(x => x.SportType.IsVirtualSports2Betradar());
        var remainingTickets = query.Tickets.Where(x => !x.SportType.IsVirtualSports2Betradar());
        if (racingSportTickets.Any())
        {
            return await ExecuteForVirtualSports2Racing(query);
        }

        if (remainingTickets.Any())
        {
            return await repository.RecoverTicketsNotVirtualSports2Racing(query, remainingTickets);
        }

        return new RecoverTicketsModel
        {
            Validation = new RecoverTicketValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = "No tickets to recover"
            },
            Tickets = []
        };
    }

    public async Task<RecoverTicketsModel> ExecuteForVirtualSports2Racing(Query query, IEnumerable<BetIdRecover> vs2RacingBetIds)
    {
        try
        {
            // get tickets
            var vs2RacingTicketsBetTrans = repository.GetTicketVs2RacingService(vs2RacingBetIds);

            // call api to update tickets
            var updatedTickets = new BetIdRecover();

            // lock match
            var result = await matchService.LockMatch(query.MatchId ?? 0, 1, 1);

            if (result.IsSuccessful)
            {
                // call SP update recover
            }

            return new RecoverTicketsModel();
        }
        catch (Exception exception)
        {
            //unlock
            var errorMessage = $"Match Id = {request.EventId} - SiteDb = {site} - {exception.Message}";
            await matchService.LockMatch(query.MatchId ?? 0, 0, 1);

            //return new Result
            //{
            //    ErrCode = 1,
            //    ErrorMsg = errorMessage
            //};
        }
    }
}