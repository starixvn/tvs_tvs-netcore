namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class CheckValidUsernamesViewModel
{
    public TransInfoAddRequestModel TransInfoAddRequestModel { get; set; }
    public ValidationInfo Validation { get; set; }
    public IEnumerable<AccountWinlostModel> AccountWinlostModels { get; set; }
}

public class ValidationInfo
{
    public bool IsExistedInOtherRequest { get; set; }

    public string InvalidUserName { get; set; }

    public string MatchIds { get; set; }

    public int NumberOfTickets { get; set; }

    public bool IsInvalidTotalTicket { get; set; }

    public bool IsBeingMoveBetDate { get; set; }

    public string UnMarkTransIds { get; set; }

    public string MarkTransIds { get; set; }

    public string UsernamesOfCreditCashService { get; set; }
}

public class CheckUsernamesInDatabaseResult
{
    public ValidationInfo ValidationResult { get; set; }

    public IEnumerable<TicketCalculateWinLostAccount> TicketCalculateWinLostAccount { get; set; }

    public IEnumerable<AccountWinlostModel> AccountWinlost { get; set; }
}