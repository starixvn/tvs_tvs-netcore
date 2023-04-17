namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class AbnormalAccountViewModel
{
    public string Usernames { get; set; }
    public string ProductIds { get; set; }
    public string StatusIds { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}