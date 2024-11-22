using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.ManageRequest.Extension;

public static class IssueTypeExtension
{
    public static bool IsAbnormalAccount(this int id)
    {
        return id == IssueTypeConstant.AbnormalAccount;
    }

    public static bool IsRedCard(this int id)
    {
        return id == IssueTypeConstant.RedCard;
    }

    public static bool IsDangerAccepted(this int id)
    {
        return id == IssueTypeConstant.DangerAccepted;
    }

    public static bool IsAbnormalBet(this int id)
    {
        return id == IssueTypeConstant.AbnormalBet;
    }

    public static bool IsDuplicateTickets(this int id)
    {
        return id == IssueTypeConstant.DuplicateTickets;
    }

    public static bool IsArchivedTicket(this int id)
    {
        return id == IssueTypeConstant.ArchivedTicket;
    }

    public static bool RecoverTicket(this int id)
    {
        return id == IssueTypeConstant.RecoverTicket;
    }

    public static bool IsWrongKickOffTime(this int id)
    {
        return id == IssueTypeConstant.WrongKickOffTime;
    }

    public static bool IsEarlyKickOffTime(this int id)
    {
        return id == IssueTypeConstant.EarlyKickOffTime;
    }

    public static bool IsWrongScore(this int id)
    {
        return id == IssueTypeConstant.WrongScore;
    }

    public static bool IsWrong1stHDP(this int id)
    {
        return id == IssueTypeConstant.Wrong1stHDP;
    }

    public static bool IsWrongHDP(this int id)
    {
        return id == IssueTypeConstant.WrongHDP;
    }

    public static bool IsWrong1stOU(this int id)
    {
        return id == IssueTypeConstant.Wrong1stOU;
    }

    public static bool IsWrongOU(this int id)
    {
        return id == IssueTypeConstant.WrongOU;
    }

    public static bool IsIssueTypeVoidMainParlay(this int id)
    {
        return id.IsAbnormalAccount() || id.IsAbnormalBet() || id.IsDuplicateTickets() || id.RecoverTicket();
    }

    public static bool IsEarlyKickOffOrWrongKickOff(this int id)
    {
        return id.IsEarlyKickOffTime() || id.IsWrongKickOffTime();
    }

    public static bool DuplicateTickets(this int id)
    {
        return id == IssueTypeConstant.DuplicateTickets;
    }

    public static bool IsWrongMarketOffered(this int id)
    {
        return id is IssueTypeConstant.WrongMarketOffered;
    }

    public static bool IsTechnicalError(this int id)
    {
        return id is IssueTypeConstant.TechnicalError;
    }
}