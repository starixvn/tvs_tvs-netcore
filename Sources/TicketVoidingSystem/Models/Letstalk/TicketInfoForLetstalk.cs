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

    public int SingleCount { get; set; }

    public int InstantOUCount { get; set; }

    public int CashOutCount { get; set; }

    public int ParlayCount { get; set; }

    public int OutstandingSingleCount { get; set; }

    public int OutstandingParlayCount { get; set; }

    public bool IsMemberTemplate { get; set; }

    public bool IsCheckMainParlay { get; set; }

    public string TargetName { get; set; }

    public string Subject { get; set; }

    public string Content { get; set; }

    public string Group { get; set; }
}