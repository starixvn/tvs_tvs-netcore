using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface FilterLinkedLogService
{
    IEnumerable<PoolHouseLinkedLogResponse> FilterApiResponse(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses);
}

public class FilterLinkedLogServiceImp : FilterLinkedLogService
{
    private readonly OddsInfoValidationService oddsInfoValidationService;

    public FilterLinkedLogServiceImp(OddsInfoValidationService oddsInfoValidationService)
    {
        this.oddsInfoValidationService = oddsInfoValidationService;
    }

    public IEnumerable<PoolHouseLinkedLogResponse> FilterApiResponse(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return getLinkedLogModel.IssueTypeId switch
        {
            IssueTypeConstant.WrongHDP => GetLinkedLogCheckValidateWrongHdp(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.Wrong1stHDP => GetLinkedLogCheckValidateWrong1StHdp(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.WrongOU => GetLinkedLogCheckValidateWrongOu(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.Wrong1stOU => GetLinkedLogCheckValidateWrong1StOu(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.WrongOdds => GetLinkedLogCheckValidateWrongOdds(getLinkedLogModel, apiLinkedLogResponses),
            _ => new List<PoolHouseLinkedLogResponse>()
        };
    }

    private IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogCheckValidateWrongHdp(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return apiLinkedLogResponses
            .Where(x => x.Time <= getLinkedLogModel.FilterToTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1X2)
            .Where(x => x.LinkedOddsInfoDic.Values
                .Any(y => y.BetType == BetTypeConstant.Handicap && oddsInfoValidationService.IsValidFavoriteWrongHdp1StHdp(y, getLinkedLogModel)))
            .OrderByDescending(x => x.Time);
    }

    private IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogCheckValidateWrong1StHdp(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return apiLinkedLogResponses
            .Where(x => x.Time <= getLinkedLogModel.FilterToTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1H1X2)
            .Where(x => x.LinkedOddsInfoDic.Values
                .Any(y => y.BetType == BetTypeConstant.FirstHalfHandicap && oddsInfoValidationService.IsValidFavoriteWrongHdp1StHdp(y, getLinkedLogModel)))
            .OrderByDescending(x => x.Time);
    }

    private IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogCheckValidateWrongOu(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return apiLinkedLogResponses
            .Where(x => x.Time <= getLinkedLogModel.FilterToTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1X2)
            .Where(x => x.LinkedOddsInfoDic.Values
                .Any(y => y.BetType == BetTypeConstant.OverUnder && oddsInfoValidationService.IsContainsValue(getLinkedLogModel.WrongMarket, y.Hdp1)))
            .OrderByDescending(x => x.Time);
    }

    private IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogCheckValidateWrong1StOu(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return apiLinkedLogResponses
            .Where(x => x.Time <= getLinkedLogModel.FilterToTransTime)
            .Where(x => x.LinkGroup is LinkedLogApiConstant.GroupIdAio or LinkedLogApiConstant.GroupId1H1X2)
            .Where(x => x.LinkedOddsInfoDic.Values
                .Any(y => y.BetType == BetTypeConstant.FirstHalfOverUnder && oddsInfoValidationService.IsContainsValue(getLinkedLogModel.WrongMarket, y.Hdp1)))
            .OrderByDescending(x => x.Time);
    }

    private IEnumerable<PoolHouseLinkedLogResponse> GetLinkedLogCheckValidateWrongOdds(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return apiLinkedLogResponses
            .Where(x => x.Time <= getLinkedLogModel.FilterToTransTime)
            .Where(x => oddsInfoValidationService.IsValidLinkGroupWrongOdds(x, getLinkedLogModel))
            .Where(x => x.LinkedOddsInfoDic.Values
                .Any(y => oddsInfoValidationService.IsValidBetTypeWrongOdds(y.BetType, getLinkedLogModel)
                          && oddsInfoValidationService.IsValidHdpWrongOdds(y, getLinkedLogModel)
                          && oddsInfoValidationService.IsValidOddsWrongOdds(y, getLinkedLogModel)))
            .OrderByDescending(x => x.Time);
    }
}