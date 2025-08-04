namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class CheckDuplicateTicketsViewModel
{
    public ValidationDuplicateTickets Validation { get; set; }

    public MatchInfoAddRequest Match { get; set; }

    public TransInfoAddRequestModel TransInfoAddRequestModel { get; set; }
}

public class ValidationDuplicateTickets
{
    public string InvalidTransIds { get; set; }

    public string MovedTransIds { get; set; }

    public string DifferentMatchTransIds { get; set; }

    public string SettledTransIds { get; set; }

    public string UnsupportedTransIds { get; set; }

    public string ExistingReqTransIds { get; set; }
}