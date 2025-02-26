using Fanex.NAP.Client.Helpers.Business;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;

public interface GetTicketsService
{
    Task<GetTicketsModel> ExecuteQuery(Query query);

    Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupModel, Recover typeOfRecover);
}

public class GetTicketsServiceImp(
    Repository repository,
    TicketService displayTicketService,
    SessionService sessionService)
    : GetTicketsService
{
    public async Task<GetTicketsModel> ExecuteQuery(Query query)
    {
        return await repository.GetTickets(query);
    }

    public async Task<Group<TicketViewModel>> AssignData(Group<GetTicketModel> groupModel, Recover typeOfRecover)
    {
        var isDisable = !await sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverVirtualSportsBet, Constant.Policy.Host);
        var index = 1;
        var tickets = new List<TicketViewModel>();
        foreach (var item in groupModel.Tickets)
        {
            var ticket = displayTicketService.GetTicket(item, typeOfRecover);
            ticket.No = index++;
            ticket.IsDisable = isDisable;
            ticket.SiteDbGroupId = item.SiteDbGroupId;
            ticket.SportType = item.SportType;
            ticket.MatchId = item.MatchId;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel> { Name = groupModel.Name, Tickets = tickets };
    }
}