using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetMaxBetAndSpreadRequest : IRequest<IEnumerable<OddsInfoModel>>
{
    public int MatchId { get; set; }

    public int ParentId { get; set; }

    public int SubType { get; set; }
}

public class GetMaxBetAndSpreadHandler(OWPHttpClientService owpHttpClientService)
    : IRequestHandler<GetMaxBetAndSpreadRequest, IEnumerable<OddsInfoModel>>
{
    public async Task<IEnumerable<OddsInfoModel>> Handle(GetMaxBetAndSpreadRequest request,
        CancellationToken cancellationToken)
    {
        var maxBetSpreadInfo = await owpHttpClientService.GetMaxBetAndSpread(request.MatchId, request.ParentId, request.SubType);

        if (maxBetSpreadInfo == null)
        {
            return [];
        }

        int[] subIssueTypeIdsWrongOdds = [SubIssueTypeConstant.Handicap, SubIssueTypeConstant.FirstHalfHandicap, SubIssueTypeConstant.OverUnder, SubIssueTypeConstant.FirstHalfOverUnder
        ];

        return subIssueTypeIdsWrongOdds.Select(subIssueTypeId => GetOddsInfo(maxBetSpreadInfo, subIssueTypeId)).ToList();
    }

    private static OddsInfoModel GetOddsInfo(OWPMaxBetAndSpreadInfo maxBetSpreadInfo, int subIssueTypeId)
    {
        return new OddsInfoModel
        {
            SubIssueTypeId = subIssueTypeId.ToString(),
            Spread = GetMaxBetSpreadBySubIssueType(maxBetSpreadInfo.Spread, subIssueTypeId)?.ToString(),
            MaxBet = GetMaxBetSpreadBySubIssueType(maxBetSpreadInfo.Maxbet, subIssueTypeId)
        };
    }

    private static decimal? GetMaxBetSpreadBySubIssueType(MaxbetSpreadByBetType maxBetSpread, int subIssueTypeId)
    {
        return subIssueTypeId switch
        {
            SubIssueTypeConstant.Handicap => maxBetSpread.Handicap,
            SubIssueTypeConstant.FirstHalfHandicap => maxBetSpread.FirstHalfHandicap,
            SubIssueTypeConstant.OverUnder => maxBetSpread.OverUnder,
            _ => maxBetSpread.FirstHalfOverUnder
        };
    }
}