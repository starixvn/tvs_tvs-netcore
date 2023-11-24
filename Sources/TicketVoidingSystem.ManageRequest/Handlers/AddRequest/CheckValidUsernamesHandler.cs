using MediatR;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckValidUsernamesRequest : IRequest<CheckValidUsernamesViewModel>
{
    public IEnumerable<AccountWinlostModel> AccountWinlostModels { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string ProductIds { get; set; }

    public string StatusIds { get; set; }
}

public class CheckValidUsernamesHandler : IRequestHandler<CheckValidUsernamesRequest, CheckValidUsernamesViewModel>
{
    private readonly CheckUsernameService checkUsernameService;
    private readonly CalculateVoidTicketsService calculateVoidTicketsService;
    private readonly CompressDataAddRequestService compressDataAddRequestService;

    public CheckValidUsernamesHandler(CheckUsernameService checkUsernameService, CalculateVoidTicketsService calculateVoidTicketsService, CompressDataAddRequestService compressDataAddRequestService)
    {
        this.checkUsernameService = checkUsernameService;
        this.calculateVoidTicketsService = calculateVoidTicketsService;
        this.compressDataAddRequestService = compressDataAddRequestService;
    }

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
                TransInfoJson = GetOutputTransInfoAddRequest(request, checkUsernamesResult.TransInfoJsonCompress, calcVoidResult.VoidTickets)
            },
            AccountWinlostModels = calcVoidResult.Accounts
        };

        ClearVoidTicketsInAccounts(calcVoidResult.Accounts);
        return viewModel;
    }

    private static IEnumerable<AccountWinlostModel> MapAdjustVoidLimitFromUserInput(IEnumerable<AccountWinlostModel> accounts, IEnumerable<AccountWinlostModel> adjustLimits)
    {
        var validAdjustLimits = adjustLimits.Where(x => x.AdjustVoidLimit > 0);
        foreach (var account in accounts)
        {
            var currentAdjustLimits = validAdjustLimits.FirstOrDefault(x => x.Username.Equals(account.Username, StringComparison.InvariantCultureIgnoreCase));
            if (currentAdjustLimits != null)
            {
                account.AdjustVoidLimit = currentAdjustLimits.AdjustVoidLimit;
            }
        }

        return accounts;
    }

    private string GetOutputTransInfoAddRequest(CheckValidUsernamesRequest query, string transInfoJsonCompress, IEnumerable<TicketCalculateWinLostAccount> voidTickets)
    {
        return query.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId
            ? compressDataAddRequestService.CompressTicket(voidTickets) : transInfoJsonCompress;
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
        if (accounts == null) return;
        foreach (var account in accounts)
        {
            account.VoidTickets = Enumerable.Empty<TicketCalculateWinLostAccount>();
        }
    }
}