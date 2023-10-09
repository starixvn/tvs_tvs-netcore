using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;

public interface GetTicketsService
{
    Task<GetTicketsModel> ExecuteQuery(GetTicketsQuery query);

    Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupModel);
}

public class GetTicketsServiceImp : GetTicketsService
{
    private readonly Repository repository;
    private readonly TicketService displayTicketService;
    private readonly SessionService sessionService;

    public GetTicketsServiceImp(
        Repository repository,
        TicketService displayTicketService,
        SessionService sessionService)
    {
        this.repository = repository;
        this.displayTicketService = displayTicketService;
        this.sessionService = sessionService;
    }

    public async Task<GetTicketsModel> ExecuteQuery(GetTicketsQuery query)
    {
        return await repository.GetTickets(query);
    }

    public async Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupModel)
    {
        var isDisable = !(await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidParlaySubBet, Constant.Policy.Host));
        var index = 1;
        var tickets = new List<TicketViewModel>();
        foreach (var item in groupModel.Tickets)
        {
            var ticket = displayTicketService.GetTicket(item);
            ticket.No = index;
            ticket.IsDisable = isDisable;
            ticket.SiteDbGroupId = item.SiteDbGroupId;
            tickets.Add(ticket);
            index++;
        }

        return new Group<TicketViewModel> { Name = groupModel.Name, Tickets = tickets };
    }
}