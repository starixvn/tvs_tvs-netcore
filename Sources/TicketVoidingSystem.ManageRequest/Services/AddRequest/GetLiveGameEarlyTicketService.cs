using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetLiveGameEarlyTicketService
{
    public TicketsViewModel GetTicketsViewModel(GetLiveGameEarlyTicketsRequest request);
}

public class GetLiveGameEarlyTicketServiceImp : GetLiveGameEarlyTicketService
{
    private readonly MapTicketsService mapTicketsService;
    private readonly PagingService pagingService;
    private readonly DecompressDataService decompressDataService;

    public GetLiveGameEarlyTicketServiceImp(MapTicketsService mapTicketsService, PagingService pagingService, DecompressDataService decompressDataService)
    {
        this.mapTicketsService = mapTicketsService;
        this.pagingService = pagingService;
        this.decompressDataService = decompressDataService;
    }

    public TicketsViewModel GetTicketsViewModel(GetLiveGameEarlyTicketsRequest request)
    {
        var getTicketModels = decompressDataService.DecompressTickets(request.LiveGameEarlyTicketsJson);
        var viewModel = new TicketsViewModel();

        if (!getTicketModels.Any())
        {
            return viewModel;
        }

        var startIndex = request.PageIndex * request.PageSize + 1;
        var afterPagingTickets = pagingService.Paging(getTicketModels, request.PageIndex, request.PageSize);
        var groupTickets = MapToGroupTicketViewModel(afterPagingTickets, ref startIndex, request.issueTypeId);

        viewModel = new TicketsViewModel
        {
            TotalSingle = getTicketModels.Count(),
            Groups = new List<Group<TicketViewModel>> { groupTickets }
        };

        return viewModel;
    }

    private Group<TicketViewModel> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> afterPagingTickets, ref int startIndex, int issueTypeId)
    {
        var tickets = new List<TicketViewModel>();

        foreach (var item in afterPagingTickets)
        {
            var ticket = mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, issueTypeId);
            ticket.SubBetTypeId = (short)item.SubBetType;
            ticket.No = startIndex++;
            tickets.Add(ticket);
        }

        return new Group<TicketViewModel>
        {
            Name = string.Empty,
            Tickets = tickets,
            DisplayTotalTickets = afterPagingTickets.Count()
        };
    }
}