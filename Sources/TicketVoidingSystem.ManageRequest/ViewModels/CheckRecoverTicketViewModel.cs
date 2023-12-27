namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class CheckRecoverTicketViewModel
{
    public string ExistingReqTransIds { get; set; }

    public string InvalidTransIds { get; set; }

    public string UnsupportedDateRangeTransIds { get; set; }

    public string TransInfoJson { get; set; }
}