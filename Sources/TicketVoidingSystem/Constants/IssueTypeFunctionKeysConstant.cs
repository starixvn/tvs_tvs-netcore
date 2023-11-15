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
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongKickOffTime, IssueTypeName = "Wrong Kick Off Time" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.EKOandWrongKO,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.EarlyKickOffTime, IssueTypeName = "Early Kick Off" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.AbnormalBet,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.AbnormalBet, IssueTypeName = "Abnormal Bet" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.AbnormalBetRealMember,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.AbnormalBetRealMember, IssueTypeName = "AB (Real Member)" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.DangerAccepted,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.DangerAccepted, IssueTypeName = "Danger Accepted" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.RedCard,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.RedCard, IssueTypeName = "Red Card" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.AbnormalAccount,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.AbnormalAccount, IssueTypeName = "Abnormal Account" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongScore,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongScore, IssueTypeName = "Wrong Score" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.ArchivedTicket,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.ArchivedTicket, IssueTypeName = "Archived Ticket" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongHDP,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongHDP, IssueTypeName = "Wrong HDP" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.Wrong1stHDP,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.Wrong1stHDP, IssueTypeName = "Wrong 1st HDP" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongOU,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongOU, IssueTypeName = "Wrong OU" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.Wrong1stOU,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.Wrong1stOU, IssueTypeName = "Wrong 1st OU" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.WrongOdds,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.WrongOdds, IssueTypeName = "Wrong Odds" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.ReducedOver,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.ReducedOver, IssueTypeName = "Reduced Over" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.DuplicateTickets,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.DuplicateTickets, IssueTypeName = "Duplicate Tickets" }
                    },
                    new()
                    {
                        FunctionKey = SpecialDeleteFunctionKeys.NotParticipate,
                        IssueType = new IssueType { IssueTypeId = IssueTypeConstant.NotParticipate, IssueTypeName = "Not Participate" }
                    }
                };

            return functionKeys;
        }
    }
}