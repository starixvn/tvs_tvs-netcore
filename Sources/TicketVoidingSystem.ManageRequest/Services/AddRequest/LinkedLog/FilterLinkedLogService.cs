using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface FilterLinkedLogService
{
    GroupLinkedLogResponse GroupBy(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses);
}

public class FilterLinkedLogServiceImp(LinkedLogValidationService linkedLogValidationService) : FilterLinkedLogService
{
    public GroupLinkedLogResponse GroupBy(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return getLinkedLogModel.IssueTypeId switch
        {
            IssueTypeConstant.WrongHDP => GetLinkedLogWrongHdp(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.Wrong1stHDP => GetLinkedLogWrong1stHdp(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.WrongOU => GetLinkedLogWrongOu(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.Wrong1stOU => GetLinkedLogWrong1stOu(getLinkedLogModel, apiLinkedLogResponses),
            IssueTypeConstant.WrongOdds => GetLinkedLogWrongOdds(getLinkedLogModel, apiLinkedLogResponses),
            _ => new GroupLinkedLogResponse()
        };
    }

    internal virtual GroupLinkedLogResponse GetLinkedLogWrongHdp(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        var affectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsAffectedLinkTime(x.Time, getLinkedLogModel))
            .Where(x => linkedLogValidationService.IsLinkGroupFullTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAffectedLinkedOddsForWrongHdp(x.LinkedOddsInfoDic, getLinkedLogModel))
            .OrderBy(x => x.Time);

        var notAffectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsNotAffectedLinkTime(x.Time, getLinkedLogModel.FilterFromTransTime))
            .Where(x => linkedLogValidationService.IsLinkGroupFullTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAnyLinkedOddsByBetType(x.LinkedOddsInfoDic, BetTypeConstant.Handicap))
            .OrderByDescending(x => x.Time);

        return new GroupLinkedLogResponse
        {
            AffectedLog = affectedLog,
            NotAffectedLog = notAffectedLog
        };
    }

    internal virtual GroupLinkedLogResponse GetLinkedLogWrong1stHdp(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        var affectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsAffectedLinkTime(x.Time, getLinkedLogModel))
            .Where(x => linkedLogValidationService.IsLinkGroupHalfTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAffectedLinkedOddsForWrong1stHdp(x.LinkedOddsInfoDic, getLinkedLogModel))
            .OrderBy(x => x.Time);

        var notAffectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsNotAffectedLinkTime(x.Time, getLinkedLogModel.FilterFromTransTime))
            .Where(x => linkedLogValidationService.IsLinkGroupHalfTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAnyLinkedOddsByBetType(x.LinkedOddsInfoDic, BetTypeConstant.FirstHalfHandicap))
            .OrderByDescending(x => x.Time);

        return new GroupLinkedLogResponse
        {
            AffectedLog = affectedLog,
            NotAffectedLog = notAffectedLog
        };
    }

    internal virtual GroupLinkedLogResponse GetLinkedLogWrongOu(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        var affectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsAffectedLinkTime(x.Time, getLinkedLogModel))
            .Where(x => linkedLogValidationService.IsLinkGroupFullTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAffectedLinkedOddsForWrongOU(x.LinkedOddsInfoDic, getLinkedLogModel))
            .OrderBy(x => x.Time);

        var notAffectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsNotAffectedLinkTime(x.Time, getLinkedLogModel.FilterFromTransTime))
            .Where(x => linkedLogValidationService.IsLinkGroupFullTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAnyLinkedOddsByBetType(x.LinkedOddsInfoDic, BetTypeConstant.OverUnder))
            .OrderByDescending(x => x.Time);

        return new GroupLinkedLogResponse
        {
            AffectedLog = affectedLog,
            NotAffectedLog = notAffectedLog
        };
    }

    internal virtual GroupLinkedLogResponse GetLinkedLogWrong1stOu(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        var affectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsAffectedLinkTime(x.Time, getLinkedLogModel))
            .Where(x => linkedLogValidationService.IsLinkGroupHalfTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAffectedLinkedOddsForWrong1stOU(x.LinkedOddsInfoDic, getLinkedLogModel))
            .OrderBy(x => x.Time);

        var notAffectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsNotAffectedLinkTime(x.Time, getLinkedLogModel.FilterFromTransTime))
            .Where(x => linkedLogValidationService.IsLinkGroupHalfTime(x.LinkGroup))
            .Where(x => linkedLogValidationService.IsAnyLinkedOddsByBetType(x.LinkedOddsInfoDic, BetTypeConstant.FirstHalfOverUnder))
            .OrderByDescending(x => x.Time);

        return new GroupLinkedLogResponse
        {
            AffectedLog = affectedLog,
            NotAffectedLog = notAffectedLog
        };
    }

    internal virtual GroupLinkedLogResponse GetLinkedLogWrongOdds(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        var affectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsAffectedLinkTime(x.Time, getLinkedLogModel))
            .Where(x => linkedLogValidationService.IsLinkGroupWrongOdds(x.LinkGroup, getLinkedLogModel.SubIssueTypeId))
            .Where(x => linkedLogValidationService.IsAffectedLinkedOddsForWrongOdds(x.LinkedOddsInfoDic, getLinkedLogModel))
            .OrderBy(x => x.Time);

        var notAffectedLog = apiLinkedLogResponses
            .Where(x => linkedLogValidationService.IsNotAffectedLinkTime(x.Time, getLinkedLogModel.FilterFromTransTime))
            .Where(x => linkedLogValidationService.IsLinkGroupWrongOdds(x.LinkGroup, getLinkedLogModel.SubIssueTypeId))
            .Where(x => linkedLogValidationService.IsAnyLinkedOddsByBetTypeForWrongOdds(x.LinkedOddsInfoDic, getLinkedLogModel))
            .OrderByDescending(x => x.Time);

        return new GroupLinkedLogResponse
        {
            AffectedLog = affectedLog,
            NotAffectedLog = notAffectedLog
        };
    }
}