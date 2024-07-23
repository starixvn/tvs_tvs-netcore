using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface LinkGroupBettypeService
{
    (bool IsLinkGroup1X2, bool IsLinkGroupAIO) CheckAffectedToGroup(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> affectedLog);
}

public class LinkGroupBettypeServiceImp : LinkGroupBettypeService
{
    public (bool IsLinkGroup1X2, bool IsLinkGroupAIO) CheckAffectedToGroup(GetLinkedLogModel getLinkedLogModel, IEnumerable<PoolHouseLinkedLogResponse> affectedLog)
    {
        var isLinkGroup1X2 = CheckAffectedByGroupId(LinkedLogApiConstant.GroupId1X2, affectedLog);
        var isLinkGroup1H1X2 = CheckAffectedByGroupId(LinkedLogApiConstant.GroupId1H1X2, affectedLog);
        var combineCheckLinkGroup1X2 = CombineCheckAffectedToGroup1X2(getLinkedLogModel, isLinkGroup1X2, isLinkGroup1H1X2);
        var isLinkGroupAIO = CheckAffectedByGroupId(LinkedLogApiConstant.GroupIdAio, affectedLog);

        return (combineCheckLinkGroup1X2, isLinkGroupAIO);
    }

    private static bool CheckAffectedByGroupId(int groupId, IEnumerable<PoolHouseLinkedLogResponse> affectedLog)
    {
        return affectedLog.Any(x => x.LinkGroup == groupId);
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