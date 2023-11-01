namespace TicketVoidingSystem.ManageRequest.Models;

public class AccountWinlostModel
{
    public int UserId { get; set; }

    public string Username { get; set; }

    public long GivenCredit { get; set; }

    public long AdjustVoidLimit { get; set; }

    public long CurrentWinning { get; set; }

    public long CurrentLosing { get; set; }

    public long EstimateVoidAmount { get; set; }

    public long WinLostAfterVoid { get; set; }
}