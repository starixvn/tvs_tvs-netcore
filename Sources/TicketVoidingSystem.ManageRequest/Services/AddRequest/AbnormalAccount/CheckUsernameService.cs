using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public record ResultTicket(ValidationInfo ValidationInfo, IEnumerable<TicketCalculateWinLostAccount> Tickets, IEnumerable<AccountWinlostModel> Accounts);

public interface CheckUsernameService
{
    Task<CheckUsernamesInDatabaseResult> GetUsernameInfo(CheckValidUsernamesRequest request);
}

public class CheckUsernameServiceImp(IDynamicRepository repository)
    : CheckUsernameService
{
    public async Task<CheckUsernamesInDatabaseResult> GetUsernameInfo(CheckValidUsernamesRequest request)
    {
        var results = await GetUsernameInfoAllSites(request);

        return new CheckUsernamesInDatabaseResult
        {
            ValidationResult = results.ValidationInfo,
            TicketCalculateWinLostAccount = results.Tickets,
            AccountWinlost = results.Accounts
        };
    }

    private async Task<ResultTicket> GetUsernameInfoAllSites(CheckValidUsernamesRequest request)
    {
        var accountAdjustVoidLimitList = GetAccountAdjustVoidLimit(request.AccountWinlostModels);
        var adjustVoidLimit = accountAdjustVoidLimitList.ToJson();
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var criteria = CreateCriteria(request, server.Id, adjustVoidLimit);
            return repository.FetchMultipleAsync<ValidationInfo, TicketCalculateWinLostAccount, AccountWinlostModel>(criteria);
        });

        var results = await Task.WhenAll(tasks);

        var validationResults = results.SelectMany(x => x.Item1);
        var ticketsResults = results.SelectMany(x => x.Item2);
        var accountResults = results.SelectMany(x => x.Item3);

        var validationInfo = CreateValidationResult(validationResults);
        return new ResultTicket(validationInfo, ticketsResults, accountResults);
    }

    private static ValidationInfo CreateValidationResult(IEnumerable<ValidationInfo> validationResults)
    {
        return new ValidationInfo
        {
            IsExistedInOtherRequest = validationResults.All(x => x.IsExistedInOtherRequest),
            NumberOfTickets = validationResults.Sum(x => x.NumberOfTickets),
            IsInvalidTotalTicket = !validationResults.Any(x => x.IsInvalidTotalTicket),
            IsBeingMoveBetDate = validationResults.All(x => x.IsBeingMoveBetDate),
            InvalidUserName = string.Join(",", validationResults.Where(x => !string.IsNullOrWhiteSpace(x.InvalidUserName)).Select(x => x.InvalidUserName)),
            MatchIds = string.Join(",", validationResults.Where(x => !string.IsNullOrWhiteSpace(x.MatchIds)).Select(x => x.MatchIds)),
            UnMarkTransIds = string.Join(",", validationResults.Where(x => !string.IsNullOrWhiteSpace(x.UnMarkTransIds)).Select(x => x.UnMarkTransIds)),
            MarkTransIds = string.Join(",", validationResults.Where(x => !string.IsNullOrWhiteSpace(x.MarkTransIds)).Select(x => x.MarkTransIds)),
        };
    }

    private static IEnumerable<AccountAdjustVoidLimit> GetAccountAdjustVoidLimit(IEnumerable<AccountWinlostModel> accountWinlostModels)
    {
        if (accountWinlostModels == null)
        {
            return [];
        }

        return accountWinlostModels.Select(account => new AccountAdjustVoidLimit
        {
            CustId = account.CustId,
            AdjustVoidLimit = account.AdjustVoidLimit
        });
    }

    private static CheckValidUsernamesCriteria CreateCriteria(CheckValidUsernamesRequest request, int siteDbGroupId, string adjustVoidLimit)
    {
        return new CheckValidUsernamesCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            Usernames = request.Usernames,
            RequestId = request.RequestId,
            ActionId = request.ActionId,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            ProductIds = request.ProductIds,
            StatusIds = request.StatusIds,
            AdjustVoidLimit = adjustVoidLimit,
            IsVoidAllArchivedTickets = request.IsVoidAllArchivedTickets,
        };
    }
}