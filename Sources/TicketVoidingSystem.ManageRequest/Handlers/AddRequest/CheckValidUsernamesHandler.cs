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
            var accounts = MapAdjustVoidLimitFromUserInput(checkUsernamesResult.AccountWinlost, request.AccountWinlostModels);
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

    private static IEnumerable<AccountWinlostModel> MapAdjustVoidLimitFromUserInput(IEnumerable<AccountWinlostModel> accounts, IEnumerable<AccountWinlostModel>? adjustLimits)
    {
        var validAdjustLimits = adjustLimits?.Where(x => x.AdjustVoidLimit > 0);
        foreach (var account in accounts)
        {
            var currentAdjustLimits = validAdjustLimits?.FirstOrDefault(x => x.Username.Equals(account.Username, StringComparison.InvariantCultureIgnoreCase));
            if (currentAdjustLimits != null)
            {
                account.AdjustVoidLimit = currentAdjustLimits.AdjustVoidLimit;
            }
        }

        return accounts;
    }

    private string GetOutputTransInfoAddRequest(CheckValidUsernamesRequest query, CheckUsernamesInDatabaseResult checkUsernamesResult, IEnumerable<TicketCalculateWinLostAccount> voidTickets)
    {
        foreach (var ticket in checkUsernamesResult.TicketCalculateWinLostAccount.Where(x => x.StatusId == TicketStatus.WonId))
        {
            ticket.IsChecked = voidTickets.Any(y => y.TransId == ticket.TransId);
        }

        return query.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId
            ? compressDataAddRequestService.CompressTicket(checkUsernamesResult.TicketCalculateWinLostAccount) : checkUsernamesResult.TransInfoJsonCompress;
    }

    private static CheckUsernamesModel GetValidationAfterCalc(CheckValidUsernamesRequest query, CheckUsernamesModel validationResult, CalcVoidTicketsResult calcVoidResult)
    {
        if (query.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId
            && !calcVoidResult.VoidTickets.Any())
        {
            validationResult.IsInvalidTotalTicket = true;
        }

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