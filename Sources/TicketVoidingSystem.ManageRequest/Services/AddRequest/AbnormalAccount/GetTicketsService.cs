using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface GetTicketsService
{
    TicketsViewModel Get(int custId, string transInfoJson);
}

public class GetTicketsServiceImp(MapTicketsService mapTicketsService, CompressDataService compressDataService) : GetTicketsService
{
    public TicketsViewModel Get(int custId, string transInfoJson)
    {
        var getTicketModels = compressDataService.DecompressTickets(transInfoJson);
        if (!getTicketModels.Any())
        {
            return new TicketsViewModel();
        }

        var viewModel = new TicketsViewModel
        {
            Groups = MapToGroupTicketViewModel(getTicketModels)
        };

        return viewModel;
    }

    private IEnumerable<Group<TicketViewModel>> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> getTicketModels)
    {
        var ticketViewModels = getTicketModels
            .Select(item => mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, IssueTypeConstant.AbnormalAccount));

        return ticketViewModels.GroupBy(b => b.GroupName)
            .Select(ToGroupTicket);
    }

    private Group<TicketViewModel> ToGroupTicket(IGrouping<string, TicketViewModel> groupTickets)
    {
        return new Group<TicketViewModel>
        {
            Name = groupTickets.Key,
            Tickets = groupTickets.ToList(),
            DisplayTotalTickets = groupTickets.Count()
        };
    }
}