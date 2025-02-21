using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class CheckValidUsernamesViewModel
{
    public TransInfoAddRequestModel TransInfoAddRequestModel { get; set; }
    public CheckUsernamesModel Validation { get; set; }
    public IEnumerable<AccountWinlostModel> AccountWinlostModels { get; set; }
}

public class CheckUsernamesModel
{
    public bool IsBeingMoveBetDate { get; set; }

    public bool IsExistedInOtherRequest { get; set; }

    public bool IsInvalidTotalTicket { get; set; }

    public bool IsExceededTotalUsernames { get; set; }

    public string InvalidUserName { get; set; }

    public string MatchIds { get; set; }

    public int NumberOfTickets { get; set; }

    public string UnMarkTransIds { get; set; }

    public bool IsTicketLimitExceeded { get; set; }
}

public class CheckUsernamesInDatabaseResult
{
    public CheckUsernamesModel ValidationResult { get; set; }
    public TransInfoAddRequestModel TransInfoValidation { get; set; }
    public string TransInfoJsonCompress { get; set; }
    public IEnumerable<TicketCalculateWinLostAccount> TicketCalculateWinLostAccount { get; set; }
    public IEnumerable<AccountWinlostModel> AccountWinlost { get; set; }
}