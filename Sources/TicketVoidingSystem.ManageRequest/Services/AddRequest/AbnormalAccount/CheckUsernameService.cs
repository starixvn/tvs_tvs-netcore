using System.Text;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface CheckUsernameService
{
    Task<CheckUsernamesInDatabaseResult> ExecuteValidationInDb(CheckValidUsernamesRequest request);
}

public class CheckUsernameServiceImp(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    : CheckUsernameService
{
    public async Task<CheckUsernamesInDatabaseResult> ExecuteValidationInDb(CheckValidUsernamesRequest request)
    {
        var transInfoJsonList = await GetTransInfoJson(request);
        if (IsTransInfoJsonTooLarge(transInfoJsonList))
        {
            return new CheckUsernamesInDatabaseResult
            {
                ValidationResult = new CheckUsernamesModel { IsTicketLimitExceeded = true }
            };
        }

        var criteria = CreateCriteria(request, transInfoJsonList);
        var (checkUsernamesModel, transInfoValidation, transInfoJsonCompress, ticketCalculateWinLostAccount, accounts) =
            await repository.FetchMultipleAsync<CheckUsernamesModel, TransInfoAddRequestModel, string, TicketCalculateWinLostAccount, AccountWinlostModel>(criteria);

        return new CheckUsernamesInDatabaseResult
        {
            ValidationResult = checkUsernamesModel.FirstOrDefault(),
            TransInfoValidation = transInfoValidation.FirstOrDefault(),
            TransInfoJsonCompress = transInfoJsonCompress.FirstOrDefault(),
            TicketCalculateWinLostAccount = ticketCalculateWinLostAccount,
            AccountWinlost = accounts
        };
    }

    private static bool IsTransInfoJsonTooLarge(IEnumerable<string> transInfoJsonList)
    {
        const int maxByteTransInfoJsonList = 5000000;
        var transInfoJson = string.Join(",", transInfoJsonList);

        return Encoding.UTF8.GetByteCount(transInfoJson) > maxByteTransInfoJsonList;
    }

    private static CheckValidUsernamesCriteria CreateCriteria(CheckValidUsernamesRequest model, IEnumerable<string> transInfoJsonList)
    {
        var criteria = new CheckValidUsernamesCriteria
        {
            Usernames = model.Usernames,
            RequestId = model.RequestId,
            ActionId = model.ActionId,
            FromDate = model.FromDate,
            ToDate = model.ToDate,
            ProductIds = model.ProductIds,
            StatusIds = model.StatusIds,
            IsVoidAllArchivedTickets = model.IsVoidAllArchivedTickets,
            TransInfoJson = string.Join(",", transInfoJsonList)
        };

        return criteria;
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckValidUsernamesRequest model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = IssueTypeConstant.AbnormalAccount,
            AbnormalAccountViewModel = new AbnormalAccountViewModel
            {
                Usernames = model.Usernames,
                FromDate = model.FromDate,
                ToDate = model.ToDate,
                ProductIds = model.ProductIds,
                StatusIds = model.StatusIds,
                IsVoidAllArchivedTickets = model.IsVoidAllArchivedTickets
            }
        };
        var transInfoJsonList = await getTransInfoService.GetTransInfoJson(getTransInfoQuery);

        return transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x));
    }
}