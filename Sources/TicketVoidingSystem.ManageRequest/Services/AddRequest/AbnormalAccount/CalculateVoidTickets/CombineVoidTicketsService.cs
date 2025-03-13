namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface CombineVoidTicketsService
{
    IEnumerable<TicketCalculateWinLostAccount> Execute(int custId, IEnumerable<int> statusIds,
        IReadOnlyDictionary<(int CustId, int StatusId), OrderedTickets> groupTickets);
}

public class CombineVoidTicketsServiceImp : CombineVoidTicketsService
{
    public IEnumerable<TicketCalculateWinLostAccount> Execute(int custId, IEnumerable<int> statusIds,
        IReadOnlyDictionary<(int CustId, int StatusId), OrderedTickets> groupTickets)
    {
        var voidTickets = new List<TicketCalculateWinLostAccount>();
        foreach (var status in statusIds)
        {
            if (groupTickets.TryGetValue((custId, status), out var currentGroup))
            {
                voidTickets.AddRange(currentGroup.Descending);
            }
        }

        return voidTickets;
    }
}