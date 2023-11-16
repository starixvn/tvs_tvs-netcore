namespace TicketVoidingSystem.ManageRequest.Models;

public class CalcVoidTicketsResult
{
    public IEnumerable<TicketCalculateWinLostAccount> VoidTickets { get; set; }
    public IEnumerable<AccountWinlostModel> Accounts { get; set; }
}