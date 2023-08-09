using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.Extensions;

public static class IssueTypeExtension
{
    public static bool IsDangerAccepted(this int issueTypeId)
    {
        return issueTypeId == IssueTypeConstant.DangerAccepted;
    }

    public static bool IsRedCard(this int issueTypeId)
    {
        return issueTypeId == IssueTypeConstant.RedCard;
    }

    public static bool IsWrongScore(this int issueTypeId)
    {
        return issueTypeId == IssueTypeConstant.WrongScore;
    }
}