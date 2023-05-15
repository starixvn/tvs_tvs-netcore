using System.Text.Json.Serialization;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Web.JsonConverter;

namespace TicketVoidingSystem.ManageRequest.Models;

public class GetTicketsQuery
{
    public Match? Match { get; set; }

    [JsonConverter(typeof(CustomDateTimeJsonConverter))]
    public DateTime? KickOffDate { get; set; }

    public int? LiveHomeScore { get; set; }

    public int? LiveAwayScore { get; set; }

    public IEnumerable<BetTypeXml>? BetTypes { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public int RequestId { get; set; }

    public int IssueTypeId { get; set; }

    public int SubIssueTypeId { get; set; }

    public int? ActionId { get; set; }

    // only user for search tickets EKO with validation existing other request
    public string? TransInfoJson { get; set; }
}