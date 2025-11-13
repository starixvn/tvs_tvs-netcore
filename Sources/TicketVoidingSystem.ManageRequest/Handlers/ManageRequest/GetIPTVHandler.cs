using MediatR;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetIPTVRequest : IRequest<string>
{
    public int MatchId { get; set; }
    public DateTime EventDate { get; set; }
}

public class GetIPTVHandler(OWPDataService owpDataService)
    : IRequestHandler<GetIPTVRequest, string>
{
    public async Task<string> Handle(GetIPTVRequest request,
        CancellationToken cancellationToken)
    {
        var matchEventDate = new MatchEventDate
        {
            MatchId = request.MatchId,
            EventDate = request.EventDate
        };
        var tvIptvData = await owpDataService.GetIPTV([matchEventDate]);
        var firstItem = tvIptvData.FirstOrDefault();

        //return firstItem != null ? $"{firstItem.TV}\n{firstItem.IPTV}" : string.Empty;
        return "tv/iptv";
    }
}