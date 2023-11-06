using System.Text;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface AccountWinLostService
{
    Task Execute(int requestId, IEnumerable<AccountWinlostModel> accountModels);
}

public class AccountWinLostServiceImp : AccountWinLostService
{
    private readonly IDynamicRepository repository;

    public AccountWinLostServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task Execute(int requestId, IEnumerable<AccountWinlostModel> accountModels)
    {
        var command = new SaveAccountWinLostCommand
        {
            RequestId = requestId,
            AccountWinLostXml = GetAccountWinLostXml(accountModels)
        };

        await repository.ExecuteAsync(command);
    }

    public static string GetAccountWinLostXml(IEnumerable<AccountWinlostModel> accountModels)
    {
        var stringBuilder = new StringBuilder();
        foreach (var model in accountModels)
        {
            var line = $"<CustId Id='{model.CustId}' />"
                + $"<Username Id='{model.Username}' />"
                + $"<GivenCredit Id='{model.GivenCredit}' />"
                + $"<AdjustVoidLimit Id='{model.AdjustVoidLimit}' />"
                + $"<CurrentWinning Id='{model.CurrentWinning}' />"
                + $"<CurrentLosing Id='{model.CurrentLosing}' />"
                + $"<EstimateVoidAmount Id='{model.EstimateVoidAmount}' />"
                + $"<WinLostAfterVoid Id='{model.WinLostAfterVoid}' />";
            stringBuilder.Append(line);
        }

        return $"{stringBuilder}";
    }
}