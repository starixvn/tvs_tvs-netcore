using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface CalculateRemainStatusService
{
    Task<CalcVoidTicketsResult> ExecuteParallel(IList<AccountWinlostModel> orderedAccounts,
        IReadOnlyDictionary<(int custId, int statusId), OrderedTickets> groupTickets, IList<int> ticketStatusIds);
}

public class CalculateRemainStatusServiceImp : CalculateRemainStatusService
{
    private readonly CombineVoidTicketsService combineVoidTicketsService;

    public CalculateRemainStatusServiceImp(CombineVoidTicketsService combineVoidTicketsService)
    {
        this.combineVoidTicketsService = combineVoidTicketsService;
    }

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

        account.IsHighlight = false;
        account.CurrentLosing = -currentLosing;
        account.CurrentWinning = currentWinning;
        account.EstimateVoidAmount = 0m;
        account.WinLostAfterVoid = 0m;
        account.VoidTickets = combineVoidTicketsService.Execute(account.CustId, ticketStatusIds, groupTickets);
    }
}