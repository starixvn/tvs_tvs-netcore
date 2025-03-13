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

    public decimal AdjustVoidLimit { get; set; }

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
        var usernameInfo = await checkUsernameService.GetUsernameInfo(request);

        if (request.ActionId is ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)
        {
            MapInformationFromUserInput(usernameInfo.AccountWinlost, request.AccountWinlostModels);
        }

        // Testing
        usernameInfo.AccountWinlost.First().IsHighlight = true;
        usernameInfo.AccountWinlost.First().IsCanEditTicket = true;
        foreach (var ticket in usernameInfo.TicketCalculateWinLostAccount)
        {
            if (ticket.TransId == 367828304981393439)
            {
                ticket.IsChecked = true;
            }
        }

        var transInfoJson = compressDataAddRequestService.CompressTicket(usernameInfo.TicketCalculateWinLostAccount);
        //

        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = usernameInfo.ValidationResult,// GetValidationAfterCalc(request, usernameInfo.ValidationResult, calcVoidResult),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                UnMarkTransIds = usernameInfo.ValidationResult.UnMarkTransIds,
                MarkTransIds = usernameInfo.ValidationResult.MarkTransIds,
                TransInfoJson = transInfoJson// GetOutputTransInfoAddRequest(request, usernameInfo, calcVoidResult.VoidTickets)
            },
            AccountWinlostModels = usernameInfo.AccountWinlost
        };

        ClearVoidTicketsInAccounts(usernameInfo.AccountWinlost);
        return viewModel;
    }

    private static void MapInformationFromUserInput(IEnumerable<AccountWinlostModel> accounts, IEnumerable<AccountWinlostModel>? originalAccounts)
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
        foreach (var ticket in checkUsernamesResult.TicketCalculateWinLostAccount.Where(x => x.StatusId == TicketStatus.WonId))
        {
            ticket.IsChecked = voidTickets.Any(y => y.TransId == ticket.TransId);
        }

        return compressDataAddRequestService.CompressTicket(
            checkUsernamesResult.TicketCalculateWinLostAccount.Where(x => ticketStatusIds.Contains(x.StatusId)));
    }

    //private static ValidationInfo GetValidationAfterCalc(CheckValidUsernamesRequest query, ValidationInfo validationResult, CalcVoidTicketsResult calcVoidResult)
    //{
    //    if (query.ActionId is not ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)
    //    {
    //        return validationResult;
    //    }

    //    if (!calcVoidResult.VoidTickets.Any())
    //    {
    //        validationResult.IsInvalidTotalTicket = true;
    //        return validationResult;
    //    }

    //    if (query.AccountWinlostModels != null)
    //    {
    //        var allEstimateVoidAmountZero = query.AccountWinlostModels.All(x => x.EstimateVoidAmount == 0);
    //        var allVoidTicketsWon = calcVoidResult.VoidTickets.All(x => string.IsNullOrWhiteSpace(x.Status) && string.Equals(x.Status, TicketStatus.Won, StringComparison.OrdinalIgnoreCase));

    //        validationResult.IsInvalidTotalTicket = allEstimateVoidAmountZero && allVoidTicketsWon;
    //    }

    //    return validationResult;
    //}

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