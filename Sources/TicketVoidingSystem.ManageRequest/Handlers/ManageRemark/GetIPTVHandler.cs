using System.Text.Json.Serialization;
using MediatR;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRemark;

public class GetIPTVRequest : IRequest<GetIPTVResponse>
{
    public int MatchId { get; set; }
    public DateTime EventDate { get; set; }
}

public class GetIPTVResponse
{
    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;
}

public class GetIPTVHandler(OWPDataService owpDataService)
    : IRequestHandler<GetIPTVRequest, GetIPTVResponse>
{
    public async Task<GetIPTVResponse> Handle(GetIPTVRequest request,
        CancellationToken cancellationToken)
    {
        var tvIptvData = await owpDataService.GetIPTV([new MatchEventDate
        {
            MatchId = request.MatchId,
            EventDate = request.EventDate
        }]);
        var firstItem = tvIptvData.FirstOrDefault();
        var iptvValue = firstItem != null ? $"{firstItem.TV}\n{firstItem.IPTV}" : string.Empty;

        return new GetIPTVResponse { Value = "tv/iptv" };
    }
}