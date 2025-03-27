using Fanex.Logging;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckValidUsernamesRequest : IRequest<CheckValidUsernamesViewModel>
{
    public string Usernames { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string ProductIds { get; set; }

    public string StatusIds { get; set; }

    public bool IsVoidAllArchivedTickets { get; set; }

    public IEnumerable<AccountWinlostModel>? AccountWinlostModels { get; set; }
}

public class CheckValidUsernamesHandler(
    UsernameCheckService usernameCheckService,
    CalculateVoidTicketsService calculateVoidTicketsService,
    CompressDataService compressDataAddRequestService)
    : IRequestHandler<CheckValidUsernamesRequest, CheckValidUsernamesViewModel>
{
    public async Task<CheckValidUsernamesViewModel> Handle(CheckValidUsernamesRequest request, CancellationToken cancellationToken)
    {
        var watch = System.Diagnostics.Stopwatch.StartNew();

        var usernameInfo = await usernameCheckService.GetUsernameInformation(request);

        var calcVoidResult = new CalcVoidTicketsResult();
        if (request.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)
        {
            var accounts = MapInformationFromUserInput(usernameInfo.AccountWinlost, request.AccountWinlostModels);
            calcVoidResult = await calculateVoidTicketsService.ExecuteForAbnormalAccountWithPolicy(request.StatusIds, usernameInfo.TicketCalculateWinLostAccount.ToList(), accounts);
        }

        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = GetValidationAfterCalc(request, usernameInfo.ValidationResult, calcVoidResult),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                UnMarkTransIds = usernameInfo.ValidationResult.UnMarkTransIds,
                MarkTransIds = usernameInfo.ValidationResult.MarkTransIds,
                TransInfoJson = GetOutputTransInfoAddRequest(request, usernameInfo, calcVoidResult.VoidTickets)
            },
            AccountWinlostModels = calcVoidResult.Accounts
        };

        watch.Stop();
        var log = $"New Abnormal account - Execute: {watch.ElapsedMilliseconds}ms - Accounts:{calcVoidResult.Accounts?.Count()}";
        await LogService.InfoAsync(log);

        ClearVoidTicketsInAccounts(calcVoidResult.Accounts);
        return viewModel;
    }

    private static IEnumerable<AccountWinlostModel> MapInformationFromUserInput(IEnumerable<AccountWinlostModel> accounts, IEnumerable<AccountWinlostModel>? originalAccounts)
    {
        var accountList = accounts.ToList();

        if (originalAccounts != null)
        {
            var originalAccountDict = originalAccounts.ToDictionary(a => a.CustId);
            foreach (var account in accountList)
            {
                account.IsShowOnTable = true;
                if (originalAccountDict.TryGetValue(account.CustId, out var currentAccount))
                {
                    account.AdjustVoidLimit = currentAccount.AdjustVoidLimit;
                    account.IsEditedTicket = currentAccount.IsEditedTicket;
                }
            }
        }
        else
        {
            foreach (var account in accountList)
            {
                account.IsShowOnTable = true;
            }
        }

        return accounts;
    }

    private string GetOutputTransInfoAddRequest(CheckValidUsernamesRequest query, CheckUsernamesInDatabaseResult checkUsernamesResult, IEnumerable<TicketCalculateWinLostAccount> voidTickets)
    {
        return query.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId
            ? GetOutputTransInfoAddRequestActionAutoVoidWithPolicy(checkUsernamesResult, voidTickets, query.StatusIds)
            : compressDataAddRequestService.CompressTicket(checkUsernamesResult.TicketCalculateWinLostAccount);
    }

    private string GetOutputTransInfoAddRequestActionAutoVoidWithPolicy(
        CheckUsernamesInDatabaseResult checkUsernamesResult, IEnumerable<TicketCalculateWinLostAccount> voidTickets, string statusIds)
    {
        var ticketStatusIds = statusIds.Split(",").Select(int.Parse).ToList();
        var voidTicketTransIds = new HashSet<long>(voidTickets.Select(x => x.TransId));

        foreach (var ticket in checkUsernamesResult.TicketCalculateWinLostAccount.Where(x => x.StatusId == TicketStatus.WonId))
        {
            ticket.IsChecked = voidTicketTransIds.Contains(ticket.TransId);
        }

        return compressDataAddRequestService.CompressTicket(
            checkUsernamesResult.TicketCalculateWinLostAccount.Where(x => ticketStatusIds.Contains(x.StatusId)));
    }

    private static ValidationInfo GetValidationAfterCalc(CheckValidUsernamesRequest query, ValidationInfo validationResult, CalcVoidTicketsResult calcVoidResult)
    {
        if (query.ActionId is not ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)
        {
            return validationResult;
        }

        if (!calcVoidResult.VoidTickets.Any())
        {
            validationResult.IsInvalidTotalTicket = true;
            return validationResult;
        }

        validationResult.IsInvalidTotalTicket = query.AccountWinlostModels != null && query.AccountWinlostModels.Any()
                                                && query.AccountWinlostModels.All(x => x.EstimateVoidAmount == 0)
                                                && calcVoidResult.VoidTickets.All(x => string.Equals(x.Status, TicketStatus.Won, StringComparison.OrdinalIgnoreCase));

        return validationResult;
    }

    private static void ClearVoidTicketsInAccounts(IEnumerable<AccountWinlostModel> accounts)
    {
        if (accounts == null)
        {
            return;
        }

        foreach (var account in accounts)
        {
            account.VoidTickets = [];
        }
    }
}