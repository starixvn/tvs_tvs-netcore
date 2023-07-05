using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface GetLinkedLogShowUiService
{
    IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogShowUi(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses);
}

public class GetLinkedLogShowUiServiceImp : GetLinkedLogShowUiService
{
    private readonly OddsInfoValidationService oddsInfoValidationService;

    public GetLinkedLogShowUiServiceImp(OddsInfoValidationService oddsInfoValidationService)
    {
        this.oddsInfoValidationService = oddsInfoValidationService;
    }

    public IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogShowUi(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses)
    {
        return getLinkedLogModel.IssueTypeId switch
        {
            IssueTypeConstant.WrongHDP => GetLinkedLogShowUiWrongHdp(getLinkedLogModel, poolHouseLinkedLogResponses),
            IssueTypeConstant.Wrong1stHDP => GetLinkedLogShowUiWrong1StHdp(getLinkedLogModel, poolHouseLinkedLogResponses),
            IssueTypeConstant.WrongOU => GetLinkedLogShowUiWrongOu(getLinkedLogModel, poolHouseLinkedLogResponses),
            IssueTypeConstant.Wrong1stOU => GetLinkedLogShowUiWrong1StOu(getLinkedLogModel, poolHouseLinkedLogResponses),
            IssueTypeConstant.WrongOdds => GetLinkedLogShowUiWrongOdds(getLinkedLogModel, poolHouseLinkedLogResponses),
            _ => new List<PoolHouseLinkedLogResponse>()
        };
    }

    private static IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogShowUiWrongHdp(
        GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses)
    {
        return poolHouseLinkedLogResponses
            .Where(x => x.Time < getLinkedLogModel.FilterFromTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1X2)
            .Where(x => x.LinkedOddsInfoDic.Values.Any(y => y.BetType == BetTypeConstant.Handicap))
            .OrderByDescending(x => x.Time);
    }

    private static IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogShowUiWrong1StHdp(
        GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses)
    {
        return poolHouseLinkedLogResponses
            .Where(x => x.Time < getLinkedLogModel.FilterFromTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1H1X2)
            .Where(x => x.LinkedOddsInfoDic.Values.Any(y => y.BetType == BetTypeConstant.FirstHalfHandicap))
            .OrderByDescending(x => x.Time);
    }

    private static IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogShowUiWrongOu(
        GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses)
    {
        return poolHouseLinkedLogResponses
            .Where(x => x.Time < getLinkedLogModel.FilterFromTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1X2)
            .Where(x => x.LinkedOddsInfoDic.Values.Any(y => y.BetType == BetTypeConstant.OverUnder))
            .OrderByDescending(x => x.Time);
    }

    private static IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogShowUiWrong1StOu(
        GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses)
    {
        return poolHouseLinkedLogResponses
            .Where(x => x.Time < getLinkedLogModel.FilterFromTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1H1X2)
            .Where(x => x.LinkedOddsInfoDic.Values.Any(y => y.BetType == BetTypeConstant.FirstHalfOverUnder))
            .OrderByDescending(x => x.Time);
    }

    private IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogShowUiWrongOdds(
        GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> poolHouseLinkedLogResponses)
    {
        return poolHouseLinkedLogResponses
            .Where(x => x.Time < getLinkedLogModel.FilterFromTransTime)
            .Where(x => oddsInfoValidationService.IsValidLinkGroupWrongOdds(x, getLinkedLogModel))
            .Where(x => x.LinkedOddsInfoDic.Values.Any(y => oddsInfoValidationService.IsValidBetTypeWrongOdds(y.BetType, getLinkedLogModel)))
            .OrderByDescending(x => x.Time);
    }
}