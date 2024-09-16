using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetLogInfoTicketsService
{
    public TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request);
}

public class GetLogInfoTicketsServiceImp : GetLogInfoTicketsService
{
    private readonly MapTicketsService mapTicketsService;
    private readonly CompressDataService compressDataService;

    public GetLogInfoTicketsServiceImp(MapTicketsService mapTicketsService, CompressDataService compressDataService)
    {
        this.mapTicketsService = mapTicketsService;
        this.compressDataService = compressDataService;
    }

    public TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request)
    {
        var getTicketModels = compressDataService.DecompressTickets(request.LogInfoTicketsJson);
        if (!getTicketModels.Any())
        {
            return new TicketsViewModel();
        }

        var voidTickets = getTicketModels.Where(x => !x.IsCancelCashOut);
        var groupTicket = MapToGroupTicketViewModel(voidTickets, request.IssueTypeId);

        var viewModel = new TicketsViewModel
        {
            TotalSingle = groupTicket.FirstOrDefault()?.DisplayTotalTickets ?? 0,
            TotalParlay = groupTicket.Find(x => x.Name == "Parlay")?.DisplayTotalTickets ?? 0,
            Groups = groupTicket
        };

        return viewModel;
    }

    private List<Group<TicketViewModel>> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> getTicketModels, int issueTypeId)
    {
        var singleTickets = new List<TicketViewModel>();
        var parlayTickets = new List<TicketViewModel>();

        foreach (var item in getTicketModels)
        {
            var ticket = mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, issueTypeId);
            ticket.SubBetTypeId = (short)item.SubBetType;
            if (ticket.IsParlay)
            {
                parlayTickets.Add(ticket);
            }
            else
            {
                singleTickets.Add(ticket);
            }
        }

        var groups = new List<Group<TicketViewModel>>();
        if (singleTickets.Any())
        {
            groups.Add(new Group<TicketViewModel>
            {
                Name = singleTickets[0].BetType,
                Tickets = singleTickets,
                DisplayTotalTickets = singleTickets.Count
            });
        }
        if (parlayTickets.Any())
        {
            groups.Add(new Group<TicketViewModel>
            {
                Name = "Parlay",
                Tickets = parlayTickets,
                DisplayTotalTickets = parlayTickets.Count
            });
        }

        return groups;
    }
}