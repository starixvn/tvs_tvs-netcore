using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.ManageRequest.Extension;

public static class IssueTypeExtension
{
    public static bool IsAbnormalAccount(this int id)
    {
        if (id == IssueTypeConstant.AbnormalAccount)
        {
            return true;
        }

        return false;
    }

    public static bool IsRedCard(this int id)
    {
        if (id == IssueTypeConstant.RedCard)
        {
            return true;
        }

        return false;
    }

    public static bool IsDangerAccepted(this int id)
    {
        if (id == IssueTypeConstant.DangerAccepted)
        {
            return true;
        }

        return false;
    }

    public static bool IsLikelyAbnormalBet(this int id)
    {
        if (id.IsAbnormalBet() || id.IsAbnormalBetRealMember())
        {
            return true;
        }

        return false;
    }

    public static bool IsAbnormalBet(this int id)
    {
        if (id == IssueTypeConstant.AbnormalBet)
        {
            return true;
        }

        return false;
    }

    public static bool IsArchivedTicket(this int id)
    {
        if (id == IssueTypeConstant.ArchivedTicket)
        {
            return true;
        }

        return false;
    }

    public static bool IsAbnormalBetRealMember(this int id)
    {
        if (id == IssueTypeConstant.AbnormalBetRealMember)
        {
            return true;
        }

        return false;
    }

    public static bool IsWrongKickOffTime(this int id)
    {
        if (id == IssueTypeConstant.WrongKickOffTime)
        {
            return true;
        }

        return false;
    }

    public static bool IsEarlyKickOffTime(this int id)
    {
        if (id == IssueTypeConstant.EarlyKickOffTime)
        {
            return true;
        }

        return false;
    }

    public static bool IsWrongScore(this int id)
    {
        if (id == IssueTypeConstant.WrongScore)
        {
            return true;
        }

        return false;
    }

    public static bool IsWrong1stHDP(this int id)
    {
        if (id == IssueTypeConstant.Wrong1stHDP)
        {
            return true;
        }

        return false;
    }

    public static bool IsWrongHDP(this int id)
    {
        if (id == IssueTypeConstant.WrongHDP)
        {
            return true;
        }

        return false;
    }

    public static bool IsWrong1stOU(this int id)
    {
        if (id == IssueTypeConstant.Wrong1stOU)
        {
            return true;
        }

        return false;
    }

    public static bool IsWrongOU(this int id)
    {
        if (id == IssueTypeConstant.WrongOU)
        {
            return true;
        }

        return false;
    }

    public static bool IsAbnormalAccountOrAbnormalBet(this int id)
    {
        return id.IsAbnormalAccount() || id.IsAbnormalBet();
    }

    public static bool IsEarlyKickOffOrWrongKickOff(this int id)
    {
        return id.IsEarlyKickOffTime() || id.IsWrongKickOffTime();
    }
}