using Fanex.NAP.Core.Business;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.ViewModels;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface GetTicketsService
{
    Task<Match> GetMatch(int matchId);

    Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query);

    Group<TicketViewModel> AssignData(Group<GetTicketModel> group, Match match);
}

public class GetTicketsServiceImp : GetTicketsService
{
    private readonly TicketService ticketService;
    private readonly ISessionService sessionService;
    private readonly Repository repository;

    public GetTicketsServiceImp(
        TicketService ticketService,
        ISessionService sessionService,
        Repository repository)
    {
        this.ticketService = ticketService;
        this.sessionService = sessionService;
        this.repository = repository;
    }

    public async Task<Match> GetMatch(int matchId)
    {
        return await repository.GetMatch(matchId);
    }

    public async Task<IEnumerable<GetTicketModel>> GetTickets(GetTicketsQuery query)
    {
        return await repository.GetTickets(query);
    }

    public Group<TicketViewModel> AssignData(Group<GetTicketModel> group, Match match)
    {
        var permission = new UserPermission
        {
            SettledTicket = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host),
            UnSettledTicket = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host),
            InstantlySettledTicket = sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledandInstantlySettledSingleBet, Constant.Policy.Host)
        };
        var tickets = new List<TicketViewModel>();
        var index = 1;
        foreach (var item in group.Tickets)
        {
            var ticket = ticketService.Render(item, match, permission);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}