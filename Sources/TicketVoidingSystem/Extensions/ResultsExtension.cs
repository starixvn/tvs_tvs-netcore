using System.Collections.Generic;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Extensions;

public static class ResultsExtension
{
    public static void InsertNegativeBalanceWarning(this IList<Result> results, string negativeBalanceUsers)
    {
        if (string.IsNullOrWhiteSpace(negativeBalanceUsers))
        {
            return;
        }

        var message = string.Format(StringResource.WarningNegativeBalance, negativeBalanceUsers);
        var result = new Result { ErrorCode = 1, ErrorMsg = message };
        results.Insert(1, result);
    }
}