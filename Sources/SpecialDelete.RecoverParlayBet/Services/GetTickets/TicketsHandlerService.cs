using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.RecoverParlayBet.Criteria;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Repositories;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions.TN;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverParlayBet.Services.GetTickets;

public interface TicketsHandlerService<T, TQ>
{
    Task<GetTicketsModel<T>> GetTickets(TQ query);

    Task<Group<TicketViewModel>> AssignData(Group<T> group);
}

public class SubTicketsHandlerServiceImp : TicketsHandlerService<GetSubTicket, GetSubTicketsQuery>
{
    private readonly Repository repository;
    private readonly SessionService sessionService;
    private readonly DisplayedTicketService<GetSubTicket> displayedTicketService;

    public SubTicketsHandlerServiceImp(
        Repository repository,
        SessionService sessionService,
        DisplayedTicketService<GetSubTicket> displayedTicketService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.displayedTicketService = displayedTicketService;
    }

    public async Task<GetTicketsModel<GetSubTicket>> GetTickets(GetSubTicketsQuery query)
    {
        var criteria = new GetSubTicketsCriteria
        {
            BetType = query.BetType,
            MatchId = query.MatchId,
            TransIds = query.TransIds.DistinctWithComma()
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.GetTickets<GetSubTicket>(criteria);
        });
        var results = await Task.WhenAll(tasks);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);
        var invalidTransIdsInAllServers = results.Select(x => x.InvalidTransIds);

        return new GetTicketsModel<GetSubTicket>
        {
            Tickets = ticketsInAllServers,
            InvalidTransIds = ProcessOutputService.CombineInvalidTransIds(invalidTransIdsInAllServers)
        };
    }

    public async Task<Group<TicketViewModel>> AssignData(Group<GetSubTicket> group)
    {
        var index = 1;
        var tickets = new List<TicketViewModel>();
        var isOnlyReadPermission = !(await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverSubParlayBet, Constant.Policy.Host));
        foreach (var item in group.Tickets)
        {
            var ticket = displayedTicketService.Map(item, isOnlyReadPermission);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}

public class MainTicketsHandlerServiceImp : TicketsHandlerService<GetMainTicket, GetMainTicketsQuery>
{
    private readonly Repository repository;
    private readonly SessionService sessionService;
    private readonly DisplayedTicketService<GetMainTicket> displayedTicketService;

    public MainTicketsHandlerServiceImp(
        Repository repository,
        SessionService sessionService,
        DisplayedTicketService<GetMainTicket> displayedTicketService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.displayedTicketService = displayedTicketService;
    }

    public async Task<GetTicketsModel<GetMainTicket>> GetTickets(GetMainTicketsQuery query)
    {
        var criteria = new GetMainTicketsCriteria
        {
            BetType = query.BetType,
            TransIds = query.TransIds.DistinctWithComma()
        };
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.GetTickets<GetMainTicket>(criteria);
        });
        var results = await Task.WhenAll(tasks);
        var ticketsInAllServers = results.SelectMany(x => x.Tickets);
        var invalidTransIdsInAllServers = results.Select(x => x.InvalidTransIds);

        return new GetTicketsModel<GetMainTicket>
        {
            Tickets = ticketsInAllServers,
            InvalidTransIds = ProcessOutputService.CombineInvalidTransIds(invalidTransIdsInAllServers)
        };
    }

    public async Task<Group<TicketViewModel>> AssignData(Group<GetMainTicket> group)
    {
        var index = 1;
        var tickets = new List<TicketViewModel>();
        var isOnlyReadPermission = !await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverMainParlayBet, Constant.Policy.Host);
        foreach (var item in group.Tickets)
        {
            var ticket = displayedTicketService.Map(item, isOnlyReadPermission);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = group.Name, Tickets = tickets };
    }
}

public static class ProcessOutputService
{
    public static IEnumerable<InvalidTransIds> CombineInvalidTransIds(IEnumerable<IEnumerable<InvalidTransIds>> invalidTransIdsInAllServers)
    {
        var invalidTransIdsComparer = new InvalidTransIdsEqualityComparer();
        var invalidTransIds = invalidTransIdsInAllServers.First();
        var movedTransIds = Enumerable.Empty<InvalidTransIds>();

        foreach (var transIds in invalidTransIdsInAllServers)
        {
            invalidTransIds = invalidTransIds.Intersect(transIds, invalidTransIdsComparer);
            movedTransIds = movedTransIds.Union(transIds, invalidTransIdsComparer);
        }

        invalidTransIds = invalidTransIds.Where(x => !x.IsMoved);
        movedTransIds = movedTransIds.Where(x => x.IsMoved);

        return invalidTransIds.Concat(movedTransIds);
    }
}