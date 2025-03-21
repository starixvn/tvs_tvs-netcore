using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface CalculateHaveStatusWonNotLoseService
{
    Task<CalcVoidTicketsResult> ExecuteParallel(IList<AccountWinlostModel> orderedAccounts,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupTickets, IList<int> ticketStatusIds);
}

public class CalculateHaveStatusWonNotLoseServiceImp(
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

    private void ExecuteByOneAccount(
        AccountWinlostModel account,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupedTickets,
        IEnumerable<int> ticketStatusIds)
    {
        var accountTickets = GetAccountTickets(account.CustId, groupedTickets);
        var creditLimit = DetermineCreditLimit(account);

        if (accountTickets.losing > creditLimit)
        {
            ProcessSpecialAccount(account, accountTickets, ticketStatusIds, groupedTickets);
        }
        else
        {
            ProcessNormalAccount(account, accountTickets, ticketStatusIds, groupedTickets);
        }
    }

    private void ProcessSpecialAccount(
        AccountWinlostModel account,
        (decimal winning, decimal losing, OrderedTickets wonTickets, OrderedTickets loseTickets) accountTickets,
        IEnumerable<int> ticketStatusIds,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupedTickets)
    {
        var voidWonTickets = accountTickets.wonTickets.Descending != null ? accountTickets.wonTickets.Descending.Where(x => x.IsChecked) : [];
        var otherVoidTickets = combineVoidTicketsService.Execute(
            account.CustId,
            ticketStatusIds.Where(x => x != TicketStatus.WonId),
            groupedTickets);

        var estimateVoidAmount = voidWonTickets.Sum(x => x.WinLost);

        account.IsHighlight = true;
        account.CurrentLosing = -accountTickets.losing;
        account.CurrentWinning = accountTickets.winning;
        account.EstimateVoidAmount = estimateVoidAmount;
        account.WinLostAfterVoid = -accountTickets.losing + (accountTickets.winning - estimateVoidAmount);
        account.VoidTickets = voidWonTickets.Concat(otherVoidTickets);

        UpdateAccountWinlostByGroupMatchId(account, accountTickets.wonTickets, voidWonTickets);
    }

    private void ProcessNormalAccount(
        AccountWinlostModel account,
        (decimal winning, decimal losing, OrderedTickets wonTickets, OrderedTickets loseTickets) accountTickets,
        IEnumerable<int> ticketStatusIds,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupedTickets)
    {
        account.IsHighlight = false;
        account.CurrentLosing = -accountTickets.losing;
        account.CurrentWinning = accountTickets.winning;
        account.EstimateVoidAmount = accountTickets.winning;
        account.WinLostAfterVoid = -accountTickets.losing;
        account.VoidTickets = combineVoidTicketsService.Execute(account.CustId, ticketStatusIds, groupedTickets);
    }

    private static (decimal winning, decimal losing, OrderedTickets wonTickets, OrderedTickets loseTickets) GetAccountTickets(
        int customerId,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupedTickets)
    {
        var wonTickets = groupedTickets.GetValueOrDefault((customerId, TicketStatus.WonId)) ?? new OrderedTickets();
        var loseTickets = groupedTickets.GetValueOrDefault((customerId, TicketStatus.LoseId)) ?? new OrderedTickets();

        return (wonTickets.TotalWinLost, loseTickets.TotalWinLost, wonTickets, loseTickets);
    }

    private static decimal DetermineCreditLimit(AccountWinlostModel account) =>
        account.AdjustVoidLimit is > 0 ? (decimal)account.AdjustVoidLimit : account.GivenCredit;

    private static void UpdateAccountWinlostByGroupMatchId(AccountWinlostModel account, OrderedTickets wonTickets, IEnumerable<TicketCalculateWinLostAccount> voidWonTickets)
    {
        if (wonTickets.Descending == null)
        {
            return;
        }

        var editableTicketGroups = wonTickets.Descending
            .GroupBy(ticket => ticket.MatchId)
            .Where(HasBothCheckedAndUncheckedTickets);

        var editableTickets = editableTicketGroups.SelectMany(x => x);
        var editableMatchIds = editableTickets.Select(x => x.MatchId).Distinct();

        account.IsCanEditTicket = editableTickets.Any();
        account.EstimateVoidAmountUnEditableTickets = voidWonTickets
            .Where(x => !editableMatchIds.Contains(x.MatchId))
            .Sum(x => x.WinLost);
    }

    private static bool HasBothCheckedAndUncheckedTickets(IGrouping<int, TicketCalculateWinLostAccount> tickets) =>
       tickets.Any(x => x.IsChecked) && tickets.Any(x => !x.IsChecked);
}