using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
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
        var getTicketModels = compressDataService.DecompressTickets<TicketCalculateWinLostAccount>(transInfoJson);
        var validTickets = GetTicketsShowPopup(getTicketModels, custId);

        if (!validTickets.Any())
        {
            return new TicketsViewModel();
        }

        var viewModel = new TicketsViewModel
        {
            Groups = MapToGroupTicketViewModel(validTickets)
        };

        return viewModel;
    }

    private static IEnumerable<TicketCalculateWinLostAccount> GetTicketsShowPopup(IEnumerable<TicketCalculateWinLostAccount> tickets, int custId)
    {
        return tickets.Where(x => x.Status.IsWon() && x.CustId == custId)
            .GroupBy(b => b.MatchId)
            .Where(x => IsHasBothCheckedAndUncheckedTickets(x.ToList()))
            .SelectMany(y => y);
    }

    private static bool IsHasBothCheckedAndUncheckedTickets(IEnumerable<TicketCalculateWinLostAccount> tickets)
    {
        return tickets.Any(x => x.IsChecked) && tickets.Any(x => !x.IsChecked);
    }

    private IEnumerable<Group<TicketViewModel>> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> tickets)
    {
        return tickets.Select(item
            => mapTicketsService.MapFromGetTicketModelToTicketViewModel(item, null, ChoiceType.None, IssueTypeConstant.AbnormalAccount))
            .GroupBy(b => b.GroupName)
            .Select(ToGroupTicket);
    }

    private Group<TicketViewModel> ToGroupTicket(IGrouping<string, TicketViewModel> groupTickets)
    {
        return new Group<TicketViewModel>
        {
            Name = groupTickets.Key,
            Tickets = ReOrderTickets(groupTickets),
            DisplayTotalTickets = groupTickets.Count()
        };
    }

    private static IEnumerable<TicketViewModel> ReOrderTickets(IEnumerable<TicketViewModel> tickets)
    {
        var orderedTickets = tickets.OrderBy(x => decimal.TryParse(x.WinLoss, out var winLossValue) ? winLossValue : 0).ThenBy(x => x.IsChecked);
        var index = 1;
        foreach (var ticket in orderedTickets)
        {
            ticket.No = index++;
        }

        return orderedTickets;
    }
}