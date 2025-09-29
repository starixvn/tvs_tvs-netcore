using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageVoidServices.Models;

public class InsertBetTicket14ResultModel : Result
{
    public string InvalidTransIds { get; set; }

    public string BalanceUpTransIds { get; set; }
}