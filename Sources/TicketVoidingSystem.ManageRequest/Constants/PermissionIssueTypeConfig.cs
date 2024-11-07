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
                    new() { FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO, IssueTypeId = IssueTypeConstant.EarlyKickOffTime },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO, IssueTypeId = IssueTypeConstant.WrongKickOffTime },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.AbnormalBet, IssueTypeId = IssueTypeConstant.AbnormalBet },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.DangerAccepted, IssueTypeId = IssueTypeConstant.DangerAccepted },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.RedCard, IssueTypeId = IssueTypeConstant.RedCard },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.AbnormalAccount, IssueTypeId = IssueTypeConstant.AbnormalAccount },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.WrongScore, IssueTypeId = IssueTypeConstant.WrongScore },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.ArchivedTicket, IssueTypeId = IssueTypeConstant.ArchivedTicket },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.WrongHDP, IssueTypeId = IssueTypeConstant.WrongHDP },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.Wrong1stHDP, IssueTypeId = IssueTypeConstant.Wrong1stHDP },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.WrongOU, IssueTypeId = IssueTypeConstant.WrongOU },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.Wrong1stOU, IssueTypeId = IssueTypeConstant.Wrong1stOU },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.WrongOdds, IssueTypeId = IssueTypeConstant.WrongOdds },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.ReducedOver, IssueTypeId = IssueTypeConstant.ReducedOver },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.Abandoned, IssueTypeId = IssueTypeConstant.Abandoned },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.DuplicateTickets, IssueTypeId = IssueTypeConstant.DuplicateTickets },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.NotParticipate, IssueTypeId = IssueTypeConstant.NotParticipate },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.RecoverTicket, IssueTypeId = IssueTypeConstant.RecoverTicket },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.WrongMarketOffered, IssueTypeId = IssueTypeConstant.WrongMarketOffered },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.TechnicalError, IssueTypeId = IssueTypeConstant.TechnicalError },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.WrongOddsSportsBook, IssueTypeId = IssueTypeConstant.WrongOddsSportsBook },
                    new() { FunctionKey = SpecialDeleteFunctionKeys.WrongOfferedName, IssueTypeId = IssueTypeConstant.WrongOfferedName }
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