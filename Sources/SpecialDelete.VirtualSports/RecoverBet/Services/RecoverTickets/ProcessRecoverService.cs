using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface ProcessRecoverService
{
    Task<RecoverTicketsModel> Execute(Query query);
}

public class ProcessRecoverServiceImp(Repository repository, LoggingService loggingService,
    RecoverRacingService recoverRacingService) : ProcessRecoverService
{
    public async Task<RecoverTicketsModel> Execute(Query query)
    {
        var racingSportTickets = query.Tickets.Where(x => x.SportType.IsVirtualSports2Betradar()).ToList();
        var remainingTickets = query.Tickets.Where(x => !x.SportType.IsVirtualSports2Betradar()).ToList();

        var racingTask = racingSportTickets.Count == 0
            ? Task.FromResult(Array.Empty<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)>())
            : recoverRacingService.Execute(racingSportTickets);
        var remainingTask = remainingTickets.Count == 0
            ? Task.FromResult(Array.Empty<(IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)>())
            : repository.RecoverNotRacingSports(query, remainingTickets);

        var results = await Task.WhenAll(racingTask, remainingTask);

        return BuildResultRecoverTickets(results.SelectMany(r => r).ToArray());
    }

    public static RecoverTicketsModel BuildResultRecoverTickets((IEnumerable<RecoverTicketsValidation>, IEnumerable<RecoverTicketModel>)[] recoverResults)
    {
        var validations = recoverResults.SelectMany(x => x.Item1);
        var tickets = recoverResults.SelectMany(x => x.Item2);
        var failedResult = validations.FirstOrDefault(x => !x.IsSuccessful);
        var validation = new RecoverTicketsValidation
        {
            ErrorCode = failedResult?.ErrorCode ?? 0,
            ErrorMsg = failedResult?.ErrorMsg ?? string.Empty,
            CompletedMatchIds = Helper.GetUnionTransIdString(validations.Select(x => x.CompletedMatchIds)),
            ReCalculatedMainTransIds = Helper.GetUnionTransIdString(validations.Select(x => x.ReCalculatedMainTransIds)),
            NegativeBalanceUsers = Helper.GetUnionTransIdString(validations.Select(x => x.NegativeBalanceUsers))
        };

        return new RecoverTicketsModel
        {
            Tickets = tickets,
            Validation = validation
        };
    }
}