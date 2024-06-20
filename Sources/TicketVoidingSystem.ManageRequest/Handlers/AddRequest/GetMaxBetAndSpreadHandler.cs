using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetMaxBetAndSpreadRequest : IRequest<OddsInfoModel>
{
    public int MatchId { get; set; }

    public int ParentId { get; set; }

    public int SubType { get; set; }

    public int SubIssueTypeId { get; set; }
}

public class GetMaxBetAndSpreadHandler : IRequestHandler<GetMaxBetAndSpreadRequest, OddsInfoModel>
{
    private readonly OWPHttpClientService owpHttpClientService;

    public GetMaxBetAndSpreadHandler(OWPHttpClientService owpHttpClientService)
    {
        this.owpHttpClientService = owpHttpClientService;
    }

    public async Task<OddsInfoModel> Handle(GetMaxBetAndSpreadRequest request, CancellationToken cancellationToken)
    {
        var maxBetSpreadInfo = await owpHttpClientService.GetMaxBetAndSpread(request.MatchId, request.ParentId, request.SubType);

        return GetOddsInfo(maxBetSpreadInfo, request.SubIssueTypeId);
    }

    private static OddsInfoModel GetOddsInfo(OWPMaxBetAndSpreadInfo maxBetSpreadInfo, int subIssueTypeId)
    {
        return new OddsInfoModel
        {
            ParentId = maxBetSpreadInfo.AdminSiteID,
            Spread = GetMaxBetSpreadBySubIssueType(maxBetSpreadInfo.Spread, subIssueTypeId),
            MaxBet = (int)GetMaxBetSpreadBySubIssueType(maxBetSpreadInfo.Maxbet, subIssueTypeId)
        };
    }

    private static decimal GetMaxBetSpreadBySubIssueType(MaxbetSpreadByBetType maxBetSpread, int subIssueTypeId)
    {
        return subIssueTypeId switch
        {
            SubIssueTypeConstant.Handicap => maxBetSpread.Handicap,
            SubIssueTypeConstant.FirstHalfHandicap => maxBetSpread.FirstHalfHandicap,
            SubIssueTypeConstant.OverUnder => maxBetSpread.OverUnder,
            _ => maxBetSpread.FirstHalfOverUnder,
        };
    }
}