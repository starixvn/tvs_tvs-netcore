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
        var selectedTickets = new List<TicketCalculateWinLostAccount>();
        decimal totalWinLost = 0;

        foreach (var ticket in wonTickets.Descending)
        {
            if (totalWinLost + ticket.WinLost < maxCapacity)
            {
                selectedTickets.Add(ticket);
                totalWinLost += ticket.WinLost;
            }
        }

        return selectedTickets;
    }
}