namespace TicketVoidingSystem.ManageRequest.Models;

public class CheckProviderMistakeTicketsResultModel
{
    public ValidationProviderMistake Validation { get; set; }
    public TransInfoAddRequestModel TransInfoAddRequest { get; set; }
}

public class ValidationProviderMistake
{
    public string ValidTransIds { get; set; }
    public string InvalidTransIds { get; set; }
    public string ExistingReqTransIds { get; set; }
    public string UnsupportedTransIds { get; set; }
}

