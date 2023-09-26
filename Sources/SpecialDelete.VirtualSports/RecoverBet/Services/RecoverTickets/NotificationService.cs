using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface NotificationService
{
    List<Result> WarningMessage(string format, string ids);

    void AddNegativeBalance(List<Result> results, string negativeBalanceUsers);
}

public class NotificationServiceImp : NotificationService
{
    public List<Result> WarningMessage(string format, string ids)
    {
        var results = new List<Result>
        {
            RecoveredSuccessful(),
            string.IsNullOrWhiteSpace(ids)
                ? RecoverTicketReturnRunning()
                : new Result
                {
                    ErrorCode = 1,
                    ErrorMsg = string.Format(format, ids)
                }
        };

        return results;
    }

    public void AddNegativeBalance(List<Result> results, string negativeBalanceUsers)
    {
        if (!string.IsNullOrWhiteSpace(negativeBalanceUsers))
        {
            results.Add(new Result
            {
                ErrorCode = 1,
                ErrorMsg = string.Format(StringResource.WarningNegativeBalance, negativeBalanceUsers)
            });
        }
    }

    private Result RecoverTicketReturnRunning()
    {
        return new Result
        {
            ErrorMsg = StringResource.RecoverTicketReturnRunning
        };
    }

    private Result RecoveredSuccessful()
    {
        return new Result
        {
            ErrorMsg = StringResource.RecoverBetSuccessfully
        };
    }
}