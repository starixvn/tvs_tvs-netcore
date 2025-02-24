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
}