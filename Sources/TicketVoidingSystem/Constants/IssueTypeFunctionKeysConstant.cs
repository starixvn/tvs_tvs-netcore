using System.Collections.Generic;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Constants;

public static class IssueTypeFunctionKeysConstant
{
    public static IEnumerable<IssueTypeFunctionKey> IssueTypeFunctionKeyList
    {
        get
        {
            var functionKeys = new List<IssueTypeFunctionKey>
                {
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongKickOffTime, IssueTypeName = "Wrong Kick Off Time" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.EarlyKickOffTime, IssueTypeName = "Early Kick Off" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.AbnormalBet,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.AbnormalBet, IssueTypeName = "Abnormal Bet" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.AbnormalBetRealMember,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.AbnormalBetRealMember, IssueTypeName = "AB (Real Member)" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.DangerAccepted,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.DangerAccepted, IssueTypeName = "Danger Accepted" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.RedCard,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.RedCard, IssueTypeName = "Red Card" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.AbnormalAccount,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.AbnormalAccount, IssueTypeName = "Abnormal Account" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongScore,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongScore, IssueTypeName = "Wrong Score" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.ArchivedTicket,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.ArchivedTicket, IssueTypeName = "Archived Ticket" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongHDP,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongHDP, IssueTypeName = "Wrong HDP" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.Wrong1stHDP,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.Wrong1stHDP, IssueTypeName = "Wrong 1st HDP" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongOU,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongOU, IssueTypeName = "Wrong OU" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.Wrong1stOU,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.Wrong1stOU, IssueTypeName = "Wrong 1st OU" }
                    },
                    new IssueTypeFunctionKey
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongOdds,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongOdds, IssueTypeName = "Wrong Odds" }
                    }
                };

            return functionKeys;
        }
    }
}