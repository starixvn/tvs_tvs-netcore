using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface LinkGroupBettypeService
{
    LinkGroupBettypeValidation CheckAffectedToGroup(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses);
}

public class LinkGroupBettypeServiceImp : LinkGroupBettypeService
{
    private readonly FilterLinkedLogService filterLinkedLogService;

    public LinkGroupBettypeServiceImp(FilterLinkedLogService filterLinkedLogService)
    {
        this.filterLinkedLogService = filterLinkedLogService;
    }

    public LinkGroupBettypeValidation CheckAffectedToGroup(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        var filterLinkedLogResult = filterLinkedLogService.FilterApiResponse(getLinkedLogModel, apiLinkedLogResponses);
        var isLinkGroup1X2 = CheckAffectedByGroupId(LinkedLogApiConstant.GroupId1X2, getLinkedLogModel, filterLinkedLogResult);
        var isLinkGroup1H1X2 = CheckAffectedByGroupId(LinkedLogApiConstant.GroupId1H1X2, getLinkedLogModel, filterLinkedLogResult);
        var combineCheckLinkGroup1X2 = CombineCheckAffectedToGroup1X2(getLinkedLogModel, isLinkGroup1X2, isLinkGroup1H1X2);
        var isLinkGroupAIO = CheckAffectedByGroupId(LinkedLogApiConstant.GroupIdAio, getLinkedLogModel, filterLinkedLogResult);

        return new LinkGroupBettypeValidation
        {
            IsLinkGroup1X2 = combineCheckLinkGroup1X2,
            IsLinkGroupAIO = isLinkGroupAIO
        };
    }

    private static bool CheckAffectedByGroupId(int groupId, GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> apiLinkedLogResponses)
    {
        return apiLinkedLogResponses
            .Where(x => x.Time >= getLinkedLogModel.FilterFromTransTime)
            .Any(x => x.LinkGroup == groupId);
    }

    private static bool CombineCheckAffectedToGroup1X2(GetLinkedLogModel getLinkedLogModel, bool isLinkGroup1X2Validation, bool isLinkGroup1H1X2Validation)
    {
        return getLinkedLogModel.IssueTypeId switch
        {
            IssueTypeConstant.WrongHDP => isLinkGroup1X2Validation,
            IssueTypeConstant.WrongOU => isLinkGroup1X2Validation,
            IssueTypeConstant.Wrong1stHDP => isLinkGroup1H1X2Validation,
            IssueTypeConstant.Wrong1stOU => isLinkGroup1H1X2Validation,
            IssueTypeConstant.WrongOdds => getLinkedLogModel.SubIssueTypeId is SubIssueTypeConstant.Handicap or SubIssueTypeConstant.OverUnder
                ? isLinkGroup1X2Validation
                : isLinkGroup1H1X2Validation,
            _ => false
        };
    }
}