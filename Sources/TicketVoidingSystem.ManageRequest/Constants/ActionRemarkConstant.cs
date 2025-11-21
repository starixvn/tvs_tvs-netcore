namespace TicketVoidingSystem.ManageRequest.Constants;

public static class ActionRemarkConstant
{
    public const string Refund = "0";
    public const string Waiting = "1";
    public const string TakeNote = "2";
    public const string VoidTicket = "3";

    public static readonly Dictionary<string, string> ActionRemark = new()
    {
        { Refund, "Refund" },
        { Waiting, "Waiting" },
        { TakeNote, "Take Note" },
        { VoidTicket, "Void Ticket" }
    };

    public static readonly Dictionary<string, string> ActionRemarkColor = new()
    {
        { Refund, "refund" },
        { Waiting, "waiting" },
        { TakeNote, "take-note" },
        { VoidTicket, "void-ticket" }
    };
}

