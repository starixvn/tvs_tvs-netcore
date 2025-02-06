using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;

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
    CheckUsernameService checkUsernameService,
    CalculateVoidTicketsService calculateVoidTicketsService,
    CompressDataService compressDataAddRequestService)
    : IRequestHandler<CheckValidUsernamesRequest, CheckValidUsernamesViewModel>
{
    public async Task<CheckValidUsernamesViewModel> Handle(CheckValidUsernamesRequest request, CancellationToken cancellationToken)
    {
        var checkUsernamesResult = await checkUsernameService.ExecuteValidationInDb(request);

        var calcVoidResult = new CalcVoidTicketsResult();
        if (request.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)
        {
            var accounts = MapInformationFromUserInput(checkUsernamesResult.AccountWinlost, request.AccountWinlostModels);
            calcVoidResult = await calculateVoidTicketsService.ExecuteForAbnormalAccountWithPolicy(request.StatusIds, checkUsernamesResult.TicketCalculateWinLostAccount.ToList(), accounts);
        }

        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = GetValidationAfterCalc(request, checkUsernamesResult.ValidationResult, calcVoidResult),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = checkUsernamesResult.TransInfoValidation.RemoveTransIds,
                UnMarkTransIds = checkUsernamesResult.TransInfoValidation.UnMarkTransIds,
                MarkTransIds = checkUsernamesResult.TransInfoValidation.MarkTransIds,
                TransInfoJson = GetOutputTransInfoAddRequest(request, checkUsernamesResult, calcVoidResult.VoidTickets)
            },
            AccountWinlostModels = calcVoidResult.Accounts
        };

        ClearVoidTicketsInAccounts(calcVoidResult.Accounts);
        return viewModel;
    }

    private static IEnumerable<AccountWinlostModel> MapInformationFromUserInput(IEnumerable<AccountWinlostModel> accounts, IEnumerable<AccountWinlostModel>? originalAccounts)
    {
        foreach (var account in accounts)
        {
            account.IsShowOnTable = true;
            var currentAccount = originalAccounts?.FirstOrDefault(x => x.CustId == account.CustId);
            if (currentAccount == null)
            {
                continue;
            }
            account.AdjustVoidLimit = currentAccount.AdjustVoidLimit;
            account.IsEditedTicket = currentAccount.IsEditedTicket;
        }

        return accounts;
    }

    private string GetOutputTransInfoAddRequest(CheckValidUsernamesRequest query, CheckUsernamesInDatabaseResult checkUsernamesResult, IEnumerable<TicketCalculateWinLostAccount> voidTickets)
    {
        return query.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId
            ? GetOutputTransInfoAddRequestActionAutoVoidWithPolicy(checkUsernamesResult, voidTickets, query.StatusIds)
            : checkUsernamesResult.TransInfoJsonCompress;
    }

    private string GetOutputTransInfoAddRequestActionAutoVoidWithPolicy(
        CheckUsernamesInDatabaseResult checkUsernamesResult, IEnumerable<TicketCalculateWinLostAccount> voidTickets, string statusIds)
    {
        var ticketStatusIds = statusIds.Split(",").Select(int.Parse).ToList();
        foreach (var ticket in checkUsernamesResult.TicketCalculateWinLostAccount.Where(x => x.StatusId == TicketStatus.WonId))
        {
            ticket.IsChecked = voidTickets.Any(y => y.TransId == ticket.TransId);
        }

        return compressDataAddRequestService.CompressTicket(
            checkUsernamesResult.TicketCalculateWinLostAccount.Where(x => ticketStatusIds.Contains(x.StatusId)));
    }

    private static CheckUsernamesModel GetValidationAfterCalc(CheckValidUsernamesRequest query, CheckUsernamesModel validationResult, CalcVoidTicketsResult calcVoidResult)
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

        validationResult.IsInvalidTotalTicket = query.AccountWinlostModels.Any()
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