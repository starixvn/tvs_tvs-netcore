using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface SortAlgorithmService
{
    IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, decimal maxCapacity);
}

public class SortAlgorithmServiceImp : SortAlgorithmService
{
    public IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, decimal maxCapacity)
    {
        var voidTickets = new List<TicketCalculateWinLostAccount>();
        decimal currentSum = 0;
        foreach (var ticket in wonTickets.Descending)
        {
            if (currentSum + ticket.WinLost >= maxCapacity)
            {
                continue;
            }

            voidTickets.Add(ticket);
            currentSum += ticket.WinLost;
        }

        return voidTickets;
    }
}