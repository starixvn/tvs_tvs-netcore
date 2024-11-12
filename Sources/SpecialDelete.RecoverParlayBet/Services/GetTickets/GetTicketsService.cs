using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

#pragma warning disable S2326

namespace SpecialDelete.RecoverParlayBet.Services.GetTickets;

public interface GetTicketsService<T, in U> where T : GetMainTicket
{
    Task<TicketsViewModel> GetTickets(U query, int matchId);
}

public class GetTicketsServiceImp<T, U>(
    TicketsHandlerService<T, U> getTicketsService,
    PagingService pagingService)
    : GetTicketsService<T, U>
    where T : GetMainTicket
{
    public async Task<TicketsViewModel> GetTickets(U query, int matchId)
    {
        var model = await getTicketsService.GetTickets(query);
        var viewModel = new TicketsViewModel { InvalidTransIds = model.InvalidTransIds.ToList() };
        var groups = pagingService.Groups(model.Tickets.ToList(), ticket => ticket.GroupName);
        foreach (var item in groups)
        {
            viewModel.Groups.Add(await getTicketsService.AssignData(item));
        }

        viewModel.Tickets = model.Tickets.Select(x => new BetId { TransId = x.TransId.ToString(), SiteDbGroupId = x.SiteDbGroupId, MatchId = matchId });

        return viewModel;
    }
}