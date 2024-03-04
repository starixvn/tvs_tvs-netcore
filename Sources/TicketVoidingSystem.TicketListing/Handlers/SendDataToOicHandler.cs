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

public class SendDataOicHandler : IRequestHandler<SendDataToOicRequest, IList<AmendmentResponse>>
{
    private readonly SendDataToOicService sendDataToOicService;
    private readonly AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService;

    public SendDataOicHandler(SendDataToOicService sendDataToOicService, AffectTicketsFromSettlementHistoryService affectTicketsFromSettlementHistoryService)
    {
        this.sendDataToOicService = sendDataToOicService;
        this.affectTicketsFromSettlementHistoryService = affectTicketsFromSettlementHistoryService;
    }

    public async Task<IList<AmendmentResponse>> Handle(SendDataToOicRequest request, CancellationToken cancellationToken)
    {
        var resultLicensees = new List<AmendmentResponse>();
        var firstQuery = request.Queries[0];
        var affectedTickets = await affectTicketsFromSettlementHistoryService.GetTickets(firstQuery.IsReSettled, firstQuery.MatchId);
        await SendForNormalLicensee(request.Queries, affectedTickets, resultLicensees);
        await SendForChinaViewLicensee(request.Queries, affectedTickets, resultLicensees);
        await SendForJollySportLicensee(request.Queries, affectedTickets, resultLicensees);
        await SendForJollySportsCvLicensee(request.Queries, affectedTickets, resultLicensees);

        return resultLicensees;
    }

    private async Task SendForNormalLicensee(IEnumerable<SendFileQuery> queries, string affectedTickets, ICollection<AmendmentResponse> response)
    {
        var normalQueries = queries.Where(x => !x.IsChinaView && x.SpecialPlatform != SpecialPlatformConstant.JollySports).ToList();
        if (normalQueries.Any())
        {
            var result = await sendDataToOicService.Send(normalQueries, affectedTickets);
            result.IsChinaView = false;
            result.SpecialPlatform = SpecialPlatformConstant.NormalSite;
            response.Add(result);
        }
    }

    private async Task SendForChinaViewLicensee(IEnumerable<SendFileQuery> queries, string affectedTickets, ICollection<AmendmentResponse> response)
    {
        var chinaViewQueries = queries.Where(x => x.IsChinaView).ToList();
        if (chinaViewQueries.Any())
        {
            var result = await sendDataToOicService.Send(chinaViewQueries, affectedTickets);
            result.IsChinaView = true;
            response.Add(result);
        }
    }

    private async Task SendForJollySportLicensee(IEnumerable<SendFileQuery> queries, string affectedTickets, ICollection<AmendmentResponse> response)
    {
        var jollySportQueries = queries.Where(x => x.SpecialPlatform == SpecialPlatformConstant.JollySports).ToList();
        if (jollySportQueries.Any())
        {
            var result = await sendDataToOicService.Send(jollySportQueries, affectedTickets);
            result.IsChinaView = false;
            result.SpecialPlatform = SpecialPlatformConstant.JollySports;
            response.Add(result);
        }
    }

    private async Task SendForJollySportsCvLicensee(IEnumerable<SendFileQuery> queries, string affectedTickets, ICollection<AmendmentResponse> response)
    {
        var jollySportsCvQueries = queries.Where(x => x.SpecialPlatform == SpecialPlatformConstant.JollySportsCv).ToList();
        if (jollySportsCvQueries.Any())
        {
            var result = await sendDataToOicService.Send(jollySportsCvQueries, affectedTickets);
            result.IsChinaView = false;
            result.SpecialPlatform = SpecialPlatformConstant.JollySportsCv;
            response.Add(result);
        }
    }
}