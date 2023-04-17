using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Constants;

public static class PermissionIssueTypeConfig
{
    public static IEnumerable<PermissionIssueType> MappingList
    {
        get
        {
            var permission = new List<PermissionIssueType>
                {
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO, IssueTypeId = IssueTypeConstant.EarlyKickOffTime },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO, IssueTypeId = IssueTypeConstant.WrongKickOffTime },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.AbnormalBet, IssueTypeId = IssueTypeConstant.AbnormalBet },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.AbnormalBetRealMember, IssueTypeId = IssueTypeConstant.AbnormalBetRealMember },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.DangerAccepted, IssueTypeId = IssueTypeConstant.DangerAccepted },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.RedCard, IssueTypeId = IssueTypeConstant.RedCard },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.AbnormalAccount, IssueTypeId = IssueTypeConstant.AbnormalAccount },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.WrongScore, IssueTypeId = IssueTypeConstant.WrongScore },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.ArchivedTicket, IssueTypeId = IssueTypeConstant.ArchivedTicket },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.WrongHDP, IssueTypeId = IssueTypeConstant.WrongHDP },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.Wrong1stHDP, IssueTypeId = IssueTypeConstant.Wrong1stHDP },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.WrongOU, IssueTypeId = IssueTypeConstant.WrongOU },
                    new PermissionIssueType { FunctionKey = SpecialDeleteFunctionKeys.Wrong1stOU, IssueTypeId = IssueTypeConstant.Wrong1stOU }
                };
            return permission;
        }
    }
}

public class PermissionIssueType
{
    public int IssueTypeId { get; set; }
    public string FunctionKey { get; set; }
}