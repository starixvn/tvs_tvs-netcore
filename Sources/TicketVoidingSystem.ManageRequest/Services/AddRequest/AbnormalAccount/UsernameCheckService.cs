using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public record TicketResult(ValidationInfo ValidationInfo, IEnumerable<TicketCalculateWinLostAccount> Tickets, IEnumerable<AccountWinlostModel> Accounts);

public interface UsernameCheckService
{
    Task<CheckUsernamesInDatabaseResult> GetUsernameInformation(CheckValidUsernamesRequest request);
}

public class UsernameCheckServiceImp(IDynamicRepository repository)
    : UsernameCheckService
{
    public async Task<CheckUsernamesInDatabaseResult> GetUsernameInformation(CheckValidUsernamesRequest request)
    {
        var results = await GetUsernameInformationForAllSites(request);

        return new CheckUsernamesInDatabaseResult
        {
            ValidationResult = results.ValidationInfo,
            TicketCalculateWinLostAccount = results.Tickets,
            AccountWinlost = results.Accounts
        };
    }

    private async Task<TicketResult> GetUsernameInformationForAllSites(CheckValidUsernamesRequest request)
    {
        var accountAdjustments = GetAccountAdjustments(request.AccountWinlostModels);
        var adjustVoidLimitJson = accountAdjustments.ToJson();
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var criteria = CreateCriteria(request, server.Id, adjustVoidLimitJson);
            return repository.FetchMultipleAsync<ValidationInfo, TicketCalculateWinLostAccount, AccountWinlostModel>(criteria);
        });

        var results = await Task.WhenAll(tasks);

        var validationResults = results.SelectMany(x => x.Item1);
        var ticketResults = results.SelectMany(x => x.Item2);
        var accountResults = results.SelectMany(x => x.Item3);

        var validationInfo = CreateValidationResult(validationResults);
        return new TicketResult(validationInfo, ticketResults, accountResults);
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

    private static IEnumerable<AccountAdjustVoidLimit> GetAccountAdjustments(IEnumerable<AccountWinlostModel> accountWinlostModels)
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

    private static CheckValidUsernamesCriteria CreateCriteria(CheckValidUsernamesRequest request, int siteDbGroupId, string adjustVoidLimitJson)
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
            AdjustVoidLimit = adjustVoidLimitJson,
            IsVoidAllArchivedTickets = request.IsVoidAllArchivedTickets,
        };
    }
}