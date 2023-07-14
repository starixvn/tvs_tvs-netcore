using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ViewModels;

public class MatchInfoAddRequestViewModel
{
    public Match Match { get; set; }

    public int ErrorCode { get; set; }

    public string ErrorMsg { get; set; }
}