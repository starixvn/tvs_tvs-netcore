using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface CalculateHaveStatusWonNotLoseService
{
    Task<CalcVoidTicketsResult> ExecuteParallel(IList<AccountWinlostModel> orderedAccounts,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupTickets, IList<int> ticketStatusIds);
}

public class CalculateHaveStatusWonNotLoseServiceImp(
    EstimateVoidWonTicketsService estimateVoidWonTicketsService,
    CombineVoidTicketsService combineVoidTicketsService)
    : CalculateHaveStatusWonNotLoseService
{
    public async Task<CalcVoidTicketsResult> ExecuteParallel(IList<AccountWinlostModel> orderedAccounts,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupTickets, IList<int> ticketStatusIds)
    {
        var accountTasks = orderedAccounts.Select(
            account => Task.Run(() => { ExecuteByOneAccount(account, groupTickets, ticketStatusIds); }));
        await Task.WhenAll(accountTasks);

        return new CalcVoidTicketsResult
        {
            VoidTickets = orderedAccounts.SelectMany(x => x.VoidTickets),
            Accounts = orderedAccounts
        };
    }

    private void ExecuteByOneAccount(AccountWinlostModel account, IReadOnlyDictionary<(int custId, int statusId),
        OrderedTickets> groupTickets, IEnumerable<int> ticketStatusIds)
    {
        var wonTickets = groupTickets.GetValueOrDefault((account.CustId, TicketStatus.WonId)) ?? new OrderedTickets();
        var loseTickets = groupTickets.GetValueOrDefault((account.CustId, TicketStatus.LoseId)) ?? new OrderedTickets();

        var currentWinning = wonTickets.TotalWinLost;
        var currentLosing = loseTickets.TotalWinLost;
        var compareCredit = account.AdjustVoidLimit is > 0 ? (decimal)account.AdjustVoidLimit : account.GivenCredit;
        if (currentLosing > compareCredit)
        {
            account.IsHighlight = true;
            account.CurrentLosing = -currentLosing;
            account.CurrentWinning = currentWinning;

            var voidWonTickets = estimateVoidWonTicketsService.Execute(wonTickets, loseTickets, compareCredit);
            var othersVoidTickets = combineVoidTicketsService.Execute(account.CustId, ticketStatusIds.Where(x => x != TicketStatus.WonId), groupTickets);
            account.EstimateVoidAmount = voidWonTickets.Sum(x => x.WinLost);
            account.WinLostAfterVoid = -currentLosing + (currentWinning - account.EstimateVoidAmount);
            account.VoidTickets = voidWonTickets.Concat(othersVoidTickets);
        }
        else
        {
            account.IsHighlight = false;
            account.CurrentLosing = -currentLosing;
            account.CurrentWinning = currentWinning;
            account.EstimateVoidAmount = currentWinning;
            account.WinLostAfterVoid = -currentLosing;
            account.VoidTickets = combineVoidTicketsService.Execute(account.CustId, ticketStatusIds, groupTickets);
        }
    }
}