using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VoidByBetId.Models;

public class GroupVoidTicketsModel
{
    public int GroupName { get; set; }
    public List<TicketEmailModel> Tickets { get; set; }
    public int Type { get; set; }
}