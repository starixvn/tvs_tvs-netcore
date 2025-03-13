namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface EstimateVoidWonTicketsService1
{
    IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit);
}

public class EstimateVoidWonTicketsServiceImp(SortAlgorithmService1 sortAlgorithmService)
    : EstimateVoidWonTicketsService1
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