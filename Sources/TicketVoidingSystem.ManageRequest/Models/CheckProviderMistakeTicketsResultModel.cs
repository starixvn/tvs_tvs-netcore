namespace TicketVoidingSystem.ManageRequest.Models;

public class CheckProviderMistakeTicketsResultModel
{
    public ValidationProviderMistake Validation { get; set; }
    public TransInfoAddRequestModel TransInfoAddRequestModel { get; set; }
}

public class ValidationProviderMistake
{
    public string InvalidTransIds { get; set; }
    public string ExistingReqTransIds { get; set; }

    /* next phase
    public string MovedTransIds { get; set; }

    public string DifferentMatchTransIds { get; set; }

    public string SettledTransIds { get; set; }

    public string UnsupportedTransIds { get; set; }
    */
}