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
            TotalSingle = voidTickets.Count(ticket => !ticket.IsMixParlay),
            TotalParlay = voidTickets.Count(ticket => ticket.IsMixParlay),
            Groups = groupTicket
        };

        return viewModel;
    }

    private IEnumerable<Group<TicketViewModel>> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> getTicketModels, int issueTypeId)
    {
        var ticketViewModels = getTicketModels.Select(item =>
        {
            var ticket = mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, issueTypeId);
            ticket.SubBetTypeId = (short)item.SubBetType;
            ticket.GroupName = GetGroupNameByIssueType(issueTypeId, ticket);

            return ticket;
        });

        return ticketViewModels.GroupBy(b => b.GroupName)
            .Select(ToGroupTicket)
            .OrderBy(group => group.Name == "Parlay")
            .ThenBy(group => group.Name);
    }

    private Group<TicketViewModel> ToGroupTicket(IGrouping<string, TicketViewModel> group)
    {
        return new Group<TicketViewModel>
        {
            Name = group.Key,
            Tickets = group.ToList(),
            DisplayTotalTickets = group.Count()
        };
    }

    private string GetGroupNameByIssueType(int issueTypeId, TicketViewModel ticket)
    {
        switch (issueTypeId)
        {
            case IssueTypeConstant.WrongHDP:
            case IssueTypeConstant.Wrong1stHDP:
            case IssueTypeConstant.WrongOU:
            case IssueTypeConstant.Wrong1stOU:
            case IssueTypeConstant.WrongOdds:
                return ticket.IsParlay ? "Parlay" : ticket.BetType;
            case IssueTypeConstant.WrongMarketOffered:
            case IssueTypeConstant.WrongOddsSportsBook:
                return string.Empty;
            default:
                return ticket.GroupName;
        }
    }
}