using System.Text.Json.Serialization;
using Settlement.Business.Core.Models;

namespace SpecialDelete.VirtualSports.RecoverBet.Models;

public class TicketsBetTransModel : Ticket
{
    [JsonPropertyName("sw")]
    public new byte? StatusWinLost { get; set; }

    [JsonPropertyName("cr")]
    public int Creator { get; set; }

    [JsonIgnore]
    public int CreatorBackUp { get; set; }
}