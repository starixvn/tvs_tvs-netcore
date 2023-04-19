using MediatR;
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
        var firstQuery = request.Queries.First();
        var affectedTickets = await affectTicketsFromSettlementHistoryService.GetTickets(firstQuery.IsReSettled, firstQuery.MatchId);
        await SendForNormalLicensee(request.Queries, affectedTickets, resultLicensees);
        await SendForChinaViewLicensee(request.Queries, affectedTickets, resultLicensees);

        return resultLicensees;
    }

    private async Task SendForNormalLicensee(IEnumerable<SendFileQuery> queries, string affectedTickets, ICollection<AmendmentResponse> response)
    {
        var normalQueries = queries.Where(x => !x.IsChinaView).ToList();
        if (normalQueries.Any())
        {
            var result = await sendDataToOicService.Send(normalQueries, affectedTickets);
            result.IsChinaView = false;
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
}