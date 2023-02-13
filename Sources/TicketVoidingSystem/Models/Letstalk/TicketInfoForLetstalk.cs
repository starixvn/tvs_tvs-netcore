namespace TicketVoidingSystem.Models.Letstalk;

public class TicketInfoForLetstalk
{
    public Match Match { get; set; }

    public string DecidedBy { get; set; }

    public string UserName { get; set; }

    public string VoidFromTime { get; set; }

    public string VoidToTime { get; set; }

    public string VoidFromDate { get; set; }

    public string VoidToDate { get; set; }

    public bool IsMemberTemplate { get; set; }

    public bool IsCheckMainParlay { get; set; }
}