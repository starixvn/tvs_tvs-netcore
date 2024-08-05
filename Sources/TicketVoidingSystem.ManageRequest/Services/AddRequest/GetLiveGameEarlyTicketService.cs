using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetLiveGameEarlyTicketService
{
    public TicketsViewModel GetTicketsViewModel(GetLiveGameEarlyTicketsRequest request);
}

public class GetLiveGameEarlyTicketServiceImp : GetLiveGameEarlyTicketService
{
    private readonly MapTicketsService mapTicketsService;
    private readonly CompressDataService compressDataService;

    public GetLiveGameEarlyTicketServiceImp(MapTicketsService mapTicketsService, CompressDataService compressDataService)
    {
        this.mapTicketsService = mapTicketsService;
        this.compressDataService = compressDataService;
    }

    public TicketsViewModel GetTicketsViewModel(GetLiveGameEarlyTicketsRequest request)
    {
        var getTicketModels = compressDataService.DecompressTickets(request.LiveGameEarlyTicketsJson);
        var viewModel = new TicketsViewModel();

        if (!getTicketModels.Any())
        {
            return viewModel;
        }

        var groupTicket = MapToGroupTicketViewModel(getTicketModels, request.issueTypeId);

        viewModel = new TicketsViewModel
        {
            TotalSingle = getTicketModels.Count(),
            Groups = new List<Group<TicketViewModel>> { groupTicket }
        };

        return viewModel;
    }

    private Group<TicketViewModel> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> getTicketModels, int issueTypeId)
    {
        var tickets = new List<TicketViewModel>();

        foreach (var item in getTicketModels)
        {
            var ticket = mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, issueTypeId);
            ticket.SubBetTypeId = (short)item.SubBetType;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel>
        {
            Name = tickets.FirstOrDefault().BetType,
            Tickets = tickets,
            DisplayTotalTickets = getTicketModels.Count()
        };
    }
}