using System.Collections.Immutable;

namespace TicketVoidingSystem.ManageRequest.Constants;

public static class ActionRemarkConstant
{
    public const string Refund = "0";
    public const string Waiting = "1";
    public const string TakeNote = "2";
    public const string VoidTicket = "3";

    public static readonly ImmutableDictionary<string, string> ActionRemark = new Dictionary<string, string>
    {
        { Refund, "Refund" },
        { Waiting, "Waiting" },
        { TakeNote, "Take Note" },
        { VoidTicket, "Void Ticket" }
    }.ToImmutableDictionary();

    public static readonly ImmutableDictionary<string, string> ActionRemarkColor = new Dictionary<string, string>
    {
        { Refund, "refund" },
        { Waiting, "waiting" },
        { TakeNote, "take-note" },
        { VoidTicket, "void-ticket" }
    }.ToImmutableDictionary();
}

