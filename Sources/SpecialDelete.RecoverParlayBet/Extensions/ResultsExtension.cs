using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace SpecialDelete.RecoverParlayBet.Extensions;

public static class ResultsExtension
{
    public static void InsertNegativeBalance(this List<Result> results, string negativeBalanceUsers)
    {
        if (!string.IsNullOrWhiteSpace(negativeBalanceUsers))
        {
            var message = string.Format(StringResource.WarningNegativeBalance, negativeBalanceUsers);
            var result = new Result { ErrorCode = 1, ErrorMsg = message };
            results.Insert(1, result);
        }
    }
}