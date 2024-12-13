using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetLogInfoTicketsService
{
    public TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request);
}

public class GetLogInfoTicketsServiceImp(MapTicketsService mapTicketsService, CompressDataService compressDataService)
    : GetLogInfoTicketsService
{
    public TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request)
    {
        var getTicketModels = compressDataService.DecompressTickets(request.LogInfoTicketsJson);
        if (!getTicketModels.Any())
        {
            return new TicketsViewModel();
        }

        var voidTickets = getTicketModels.Where(x => !x.IsCancelCashOut);
        var affectedTickets = voidTickets.Where(x => !x.IsOtherTicket);
        var otherTickets = voidTickets.Where(x => x.IsOtherTicket);
        var groupTicket = MapToGroupTicketViewModel(affectedTickets, request.IssueTypeId);
        var groupOtherTickets = MapToGroupTicketViewModel(otherTickets, request.IssueTypeId);

        var viewModel = new TicketsViewModel
        {
            TotalSingle = affectedTickets.Count(ticket => !ticket.IsMixParlay),
            TotalParlay = affectedTickets.Count(ticket => ticket.IsMixParlay),
            Groups = groupTicket,
            IsHasSettledTicket = affectedTickets.Any(ticket => ticket.IsSettledTicket()),
            FromTime = affectedTickets.Min(ticket => ticket.TransDate),
            ToTime = affectedTickets.Max(ticket => ticket.TransDate),
            GroupOtherTickets = groupOtherTickets
        };

        return viewModel;
    }

    private IEnumerable<Group<TicketViewModel>> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> getTicketModels, int issueTypeId)
    {
        var ticketViewModels = getTicketModels.Select((item) =>
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
        HashSet<int> IssueTypesHasTicketParlay =
        [
            IssueTypeConstant.WrongHDP, IssueTypeConstant.Wrong1stHDP, IssueTypeConstant.WrongOU,
            IssueTypeConstant.Wrong1stOU, IssueTypeConstant.WrongOdds
        ];

        if (IssueTypesHasTicketParlay.Contains(issueTypeId))
        {
            return ticket.IsParlay ? "Parlay" : ticket.BetType;
        }

        return issueTypeId is IssueTypeConstant.WrongMarketOffered or IssueTypeConstant.WrongOddsSportsBook
            or IssueTypeConstant.TechnicalError or IssueTypeConstant.OtherIssues
            ? string.Empty
            : ticket.GroupName;
    }
}