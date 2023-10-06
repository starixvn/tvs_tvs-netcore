using System.Text.Json.Serialization;
using TicketVoidingSystem.Web.JsonConverter;

namespace TicketVoidingSystem.ManageRequest.ViewModels;

public class EarlyKickOffViewModel
{
    public int MatchId { get; set; }

    public string? MatchCode { get; set; }

    public string? Name { get; set; }

    public string? LeagueName { get; set; }

    public bool IsMainMatch { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    [JsonConverter(typeof(GMT8DateTimeJsonConverter))]
    public DateTime? KickOffTime { get; set; }

    public DateTime? EventDate { get; set; }
}