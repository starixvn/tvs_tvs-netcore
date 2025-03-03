using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface EstimateVoidWonTicketsService
{
    IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit);
}

public class EstimateVoidWonTicketsServiceImp(SortAlgorithmService sortAlgorithmService)
    : EstimateVoidWonTicketsService
{
    private static decimal GetMaxCapacity(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit)
    {
        return compareCredit - (loseTickets.TotalWinLost - wonTickets.TotalWinLost);
    }

    public IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit)
    {
        var maxCapacity = GetMaxCapacity(wonTickets, loseTickets, compareCredit);
        return maxCapacity > 0 ? sortAlgorithmService.Execute(wonTickets, maxCapacity) : [];
    }
}