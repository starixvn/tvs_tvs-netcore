using System.Text;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface AccountWinLostService
{
    Task SaveAccountWinLost(int requestId, int? actionId, IEnumerable<AccountWinlostModel> accountModels);

    Task<IEnumerable<AccountWinlostModel>> GetAccountWinLost(GetAccountWinLostQuery query);

    IEnumerable<AccountWinlostExcelModel> GetAccountWinLostExcel(IEnumerable<AccountWinlostModel> models);
}

public class AccountWinLostServiceImp(IDynamicRepository repository) : AccountWinLostService
{
    public async Task SaveAccountWinLost(int requestId, int? actionId, IEnumerable<AccountWinlostModel>? accountModels)
    {
        var command = new SaveAccountWinLostCommand
        {
            RequestId = requestId,
            ActionId = actionId,
            AccountWinLostXml = GetAccountWinLostXml(accountModels)
        };

        await repository.ExecuteAsync(command);
    }

    private static string GetAccountWinLostXml(IEnumerable<AccountWinlostModel> accountModels)
    {
        if (accountModels == null)
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var model in accountModels)
        {
            var line = $"<r CustId='{model.CustId}' "
                + $"Username='{model.Username}' "
                + $"GivenCredit='{model.GivenCredit}' "
                + $"AdjustVoidLimit='{model.AdjustVoidLimit}' "
                + $"CurrentWinning='{model.CurrentWinning}' "
                + $"CurrentLosing='{model.CurrentLosing}' "
                + $"EstimateVoidAmount='{model.EstimateVoidAmount}' "
                + $"WinLostAfterVoid='{model.WinLostAfterVoid}' />";
            stringBuilder.Append(line);
        }

        return $"<root>{stringBuilder}</root>";
    }

    public async Task<IEnumerable<AccountWinlostModel>> GetAccountWinLost(GetAccountWinLostQuery query)
    {
        var criteria = new GetAccountWinLostCriteria
        {
            RequestId = query.RequestId
        };

        var accounts = await repository.FetchAsync<AccountWinlostModel>(criteria);
        foreach (var account in accounts)
        {
            var compareCredit = account.AdjustVoidLimit is > 0 ? (decimal)account.AdjustVoidLimit : account.GivenCredit;
            account.IsHighlight = account.CurrentLosing > compareCredit;
            account.IsShowOnTable = true;
        }

        return accounts;
    }

    public IEnumerable<AccountWinlostExcelModel> GetAccountWinLostExcel(IEnumerable<AccountWinlostModel> models)
    {
        var index = 1;
        return models.Select(x => new AccountWinlostExcelModel
        {
            No = index++,
            Username = x.Username,
            GivenCredit = x.GivenCredit,
            AdjustVoidLimit = x.AdjustVoidLimit,
            CurrentWinning = x.CurrentWinning,
            CurrentLosing = x.CurrentLosing,
            EstimateVoidAmount = x.EstimateVoidAmount,
            WinLostAfterVoid = x.WinLostAfterVoid,
            IsHighlight = x.IsHighlight
        });
    }
}