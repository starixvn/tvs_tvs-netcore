namespace TicketVoidingSystem.ManageRequest.Constants;

public static class RemarkConstant
{
    public const string InvalidTicket = "Invalid ticket";
    public const string SettledTicket = "Settled ticket";
    public const string UnsupportedTicket = "Unsupported ticket";
    public const string ExistingOnOtherRequest = "Existing on other request";
    public const string AbWhiteListTransIds = "AB Exection List ticket";
    public const string NonLiveTicket = "Non-Live ticket";
    public const string DifferentLiveScore = "Different live score";
    public const string MovedOrDuplicatedTicket = "Moved or Duplicated tickets";
    public const string DifferentMatch = "Different match";
    public const string Default = "";
    public const string TicketSiteDbDown = "Ticket of siteDB down";
    public const string BalanceUpTransIds = "Being Balance Up";

    public const byte InvalidTicketId = 1;
    public const byte MovedOrDuplicatedTicketId = 2;
    public const byte DifferentMatchId = 3;
    public const byte SettledTicketId = 4;
    public const byte UnsupportedTicketId = 5;
    public const byte ExistingOnOtherRequestId = 6;
    public const byte NonLiveTicketId = 7;
    public const byte DifferentLiveScoreId = 8;
    public const byte AbWhiteListTransIdsId = 9;
    public const byte DefaultId = 0;
    public const byte TicketSiteDbDownId = 10;
    public const byte BalanceUpTransIdsId = 11;

    public static IEnumerable<RemarkModel> RemarkList =>
        new List<RemarkModel>
        {
            new() { Id = InvalidTicketId, Name = InvalidTicket },
            new() { Id = MovedOrDuplicatedTicketId, Name = MovedOrDuplicatedTicket },
            new() { Id = DifferentMatchId, Name = DifferentMatch },
            new() { Id = ExistingOnOtherRequestId, Name = ExistingOnOtherRequest },
            new() { Id = SettledTicketId, Name = SettledTicket },
            new() { Id = UnsupportedTicketId, Name = UnsupportedTicket },
            new() { Id = AbWhiteListTransIdsId, Name = AbWhiteListTransIds },
            new() { Id = NonLiveTicketId, Name = NonLiveTicket },
            new() { Id = DifferentLiveScoreId, Name = DifferentLiveScore },
            new() { Id = DefaultId, Name = Default },
            new() { Id = TicketSiteDbDownId, Name = TicketSiteDbDown },
            new() { Id = BalanceUpTransIdsId, Name = BalanceUpTransIds }
        };
}

public class RemarkModel
{
    public string Name { get; set; }
    public int Id { get; set; }
}