using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class SendDataToOicRequest : IRequest<IList<AmendmentResponse>>
{
    public IList<SendFileQuery> Queries { get; set; }
}

public class SendDataOicHandler(
    SendDataToOicService sendDataToOicService,
    AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService)
    : IRequestHandler<SendDataToOicRequest, IList<AmendmentResponse>>
{
    public async Task<IList<AmendmentResponse>> Handle(SendDataToOicRequest request, CancellationToken cancellationToken)
    {
        var resultLicensees = new List<AmendmentResponse>();
        var firstQuery = request.Queries[0];
        var affectedTickets = await affectTicketsFromSettlementHistoryService.GetTickets(firstQuery.IsReSettled, firstQuery.MatchId);

        var normalQueries = request.Queries.Where(x => !x.IsChinaView && x.SpecialPlatform
            != SpecialPlatformConstant.JollySports && x.SpecialPlatform != SpecialPlatformConstant.JollySportsCv).ToList();
        if (normalQueries.Any())
        {
            resultLicensees.Add(await SendDataLicensee(normalQueries, affectedTickets, false, SpecialPlatformConstant.NormalSite));
        }

        var chinaViewQueries = request.Queries.Where(x => x.IsChinaView).ToList();
        if (chinaViewQueries.Any())
        {
            resultLicensees.Add(await SendDataLicensee(chinaViewQueries, affectedTickets, true, SpecialPlatformConstant.NormalSite));
        }

        var jollySportQueries = request.Queries.Where(x => x.SpecialPlatform == SpecialPlatformConstant.JollySports).ToList();
        if (jollySportQueries.Any())
        {
            resultLicensees.Add(await SendDataLicensee(jollySportQueries, affectedTickets, false, SpecialPlatformConstant.JollySports));
        }

        var jollySportCvQueries = request.Queries.Where(x => x.SpecialPlatform == SpecialPlatformConstant.JollySportsCv).ToList();
        if (jollySportCvQueries.Any())
        {
            resultLicensees.Add(await SendDataLicensee(jollySportCvQueries, affectedTickets, false, SpecialPlatformConstant.JollySportsCv));
        }

        return resultLicensees;
    }

    private async Task<AmendmentResponse> SendDataLicensee(IList<SendFileQuery> queries, string affectedTickets, bool isChinaView, int specialPlatform)
    {
        var result = await sendDataToOicService.Send(queries, affectedTickets);
        result.IsChinaView = isChinaView;
        result.SpecialPlatform = specialPlatform;
        return result;
    }
}