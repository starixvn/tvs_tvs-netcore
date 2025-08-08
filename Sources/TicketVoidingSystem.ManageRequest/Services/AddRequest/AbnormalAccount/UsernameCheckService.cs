using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public record TicketResult(ValidationInfo ValidationInfo, IEnumerable<TicketCalculateWinLostAccount> Tickets, IEnumerable<AccountWinlostModel> Accounts);

public interface UsernameCheckService
{
    Task<CheckUsernamesInDatabaseResult> GetUsernameInformation(CheckValidUsernamesRequest request);
}

public class UsernameCheckServiceImp(OnlineServerRepository onlineServerRepository)
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
        var criteria = await CreateCriteria(request, adjustVoidLimitJson);
        var (validationResults, ticketResults, accountResults) =
            await onlineServerRepository.FetchMultipleAsync<ValidationInfo, TicketCalculateWinLostAccount, AccountWinlostModel>(criteria);

        var validationInfo = CreateValidationResult(validationResults);
        return new TicketResult(validationInfo, ticketResults, accountResults);
    }

    private static ValidationInfo CreateValidationResult(IEnumerable<ValidationInfo> validationResults)
    {
        var results = validationResults.ToList();
        var siteDBDownInfo = results.FirstOrDefault(x => x.SiteDBDownInfoJson != null);

        return new ValidationInfo
        {
            IsExistedInOtherRequest = results.TrueForAll(x => x.IsExistedInOtherRequest),
            NumberOfTickets = results.Sum(x => x.NumberOfTickets),
            IsInvalidTotalTicket = DetermineIsInvalidTotalTicket(results),
            IsBeingMoveBetDate = results.TrueForAll(x => x.IsBeingMoveBetDate),
            InvalidUserName = JoinNonEmptyValues(results, x => x.InvalidUserName),
            MatchIds = JoinNonEmptyValues(results, x => x.MatchIds),
            UnMarkTransIds = JoinNonEmptyValues(results, x => x.UnMarkTransIds),
            MarkTransIds = JoinNonEmptyValues(results, x => x.MarkTransIds),
            UsernamesOfCreditCashService = JoinNonEmptyValues(results, x => x.UsernamesOfCreditCashService),
            SiteDBDownUserNames = siteDBDownInfo?.SiteDBDownUserNames,
            SiteDBDownInfoJson = siteDBDownInfo?.SiteDBDownInfoJson
        };
    }

    private static string JoinNonEmptyValues(IEnumerable<ValidationInfo> results, Func<ValidationInfo, string> selector)
    {
        return string.Join(",", results.Where(x => !string.IsNullOrWhiteSpace(selector(x))).Select(selector));
    }

    private static bool DetermineIsInvalidTotalTicket(IReadOnlyCollection<ValidationInfo> results)
    {
        var hasAnyInvalidTicket = results.Any(x => !x.IsInvalidTotalTicket);
        if (hasAnyInvalidTicket)
        {
            return false;
        }

        var allTicketsAreInvalid = results.All(x => x.IsInvalidTotalTicket);
        return allTicketsAreInvalid;
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

    private async Task<CheckValidUsernamesCriteria> CreateCriteria(CheckValidUsernamesRequest request, string adjustVoidLimitJson)
    {
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();

        return new CheckValidUsernamesCriteria
        {
            Usernames = request.Usernames,
            RequestId = request.RequestId,
            ActionId = request.ActionId,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            ProductIds = request.ProductIds,
            StatusIds = request.StatusIds,
            AdjustVoidLimit = adjustVoidLimitJson,
            IsVoidAllArchivedTickets = request.IsVoidAllArchivedTickets,
            IsRemoveCreditCashService = request.IsRemoveCreditCashService,
            OnlineServerId = currentOnlineServerId
        };
    }
}