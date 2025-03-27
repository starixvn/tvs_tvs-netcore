using System.Collections.Concurrent;
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
    private const int PARALLEL_THRESHOLD = 1000;

    public TicketsViewModel Get(int custId, string transInfoJson)
    {
        var getTicketModels = compressDataService.DecompressTickets<TicketCalculateWinLostAccount>(transInfoJson);
        if (getTicketModels == null || !getTicketModels.Any())
        {
            return new TicketsViewModel();
        }

        var validTickets = FilterValidTickets(getTicketModels, custId);
        if (validTickets.Count == 0)
        {
            return new TicketsViewModel();
        }

        return new TicketsViewModel
        {
            Groups = ProcessTicketGroups(validTickets)
        };
    }

    private static List<TicketCalculateWinLostAccount> FilterValidTickets(
        IEnumerable<TicketCalculateWinLostAccount> tickets,
        int custId)
    {
        var filteredTickets = tickets
            .Where(x => x.Status.IsWon() && x.CustId == custId)
            .ToList();

        return filteredTickets
            .GroupBy(b => b.MatchId)
            .AsParallel()
            .Where(HasBothCheckedAndUncheckedTickets)
            .SelectMany(y => y)
            .ToList();
    }

    private static bool HasBothCheckedAndUncheckedTickets(IEnumerable<TicketCalculateWinLostAccount> tickets)
    {
        var hasChecked = false;
        var hasUnchecked = false;

        foreach (var ticket in tickets)
        {
            if (ticket.IsChecked)
            {
                hasChecked = true;
            }
            else
            {
                hasUnchecked = true;
            }

            if (hasChecked && hasUnchecked)
            {
                return true;
            }
        }

        return false;
    }

    private IEnumerable<Group<TicketViewModel>> ProcessTicketGroups(IEnumerable<GetTicketModel> tickets)
    {
        var ticketsList = tickets.ToList();
        var mappedTickets = ticketsList.Count > PARALLEL_THRESHOLD
            ? ProcessTicketsParallel(ticketsList)
            : ProcessTicketsSequential(ticketsList);

        return CreateTicketGroups(mappedTickets);
    }

    private IEnumerable<TicketViewModel> ProcessTicketsParallel(List<GetTicketModel> tickets)
    {
        var results = new ConcurrentBag<TicketViewModel>();

        Parallel.ForEach(tickets, ticket =>
        {
            var viewModel = mapTicketsService.MapFromGetTicketModelToTicketViewModel(
                ticket,
                null,
                ChoiceType.None,
                IssueTypeConstant.AbnormalAccount);
            results.Add(viewModel);
        });

        return results;
    }

    private IEnumerable<TicketViewModel> ProcessTicketsSequential(List<GetTicketModel> tickets)
    {
        var results = new List<TicketViewModel>(tickets.Count);
        foreach (var ticket in tickets)
        {
            results.Add(mapTicketsService.MapFromGetTicketModelToTicketViewModel(
                ticket,
                null,
                ChoiceType.None,
                IssueTypeConstant.AbnormalAccount));
        }

        return results;
    }

    private static IEnumerable<Group<TicketViewModel>> CreateTicketGroups(IEnumerable<TicketViewModel> tickets)
    {
        var groupedTickets = tickets
            .GroupBy(b => b.GroupName)
            .ToList();

        var results = new List<Group<TicketViewModel>>(groupedTickets.Count);
        foreach (var group in groupedTickets)
        {
            results.Add(new Group<TicketViewModel>
            {
                Name = group.Key,
                Tickets = ReorderTickets(group),
                DisplayTotalTickets = group.Count()
            });
        }

        return results;
    }

    private static IEnumerable<TicketViewModel> ReorderTickets(IGrouping<string, TicketViewModel> tickets)
    {
        return tickets
            .AsParallel()
            .OrderBy(x => ParseWinLoss(x.WinLoss))
            .ThenBy(x => x.IsChecked)
            .Select((ticket, index) =>
            {
                ticket.No = index + 1;
                return ticket;
            })
            .ToList();
    }

    private static decimal ParseWinLoss(string winLoss)
    {
        return decimal.TryParse(winLoss, out var value) ? value : 0;
    }
}