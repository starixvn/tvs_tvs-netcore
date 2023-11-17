using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface CalculateVoidTicketsService
{
    Task<CalcVoidTicketsResult> ExecuteForAbnormalAccountWithPolicy(string statusIds, IList<TicketCalculateWinLostAccount> tickets,
        IEnumerable<AccountWinlostModel> accounts);
}

public class CalculateVoidTicketsServiceImp : CalculateVoidTicketsService
{
    private readonly CalculateHaveStatusWonNotLoseService calculateHaveStatusWonNotLoseService;
    private readonly CalculateRemainStatusService calculateRemainStatusService;

    public CalculateVoidTicketsServiceImp(CalculateHaveStatusWonNotLoseService calculateHaveStatusWonNotLoseService, CalculateRemainStatusService calculateRemainStatusService)
    {
        this.calculateHaveStatusWonNotLoseService = calculateHaveStatusWonNotLoseService;
        this.calculateRemainStatusService = calculateRemainStatusService;
    }

    public async Task<CalcVoidTicketsResult> ExecuteForAbnormalAccountWithPolicy(string statusIds, IList<TicketCalculateWinLostAccount> tickets,
        IEnumerable<AccountWinlostModel> accounts)
    {
        var ticketStatusIds = statusIds.Split(",").Select(int.Parse).ToList();
        var orderedAccounts = accounts.OrderBy(x => x.Username).ToList();
        var groupTickets = GroupTicketsByCustIdAndStatus(tickets);

        if (ticketStatusIds.Contains(TicketStatus.WonId) && !ticketStatusIds.Contains(TicketStatus.LoseId))
        {
            return await calculateHaveStatusWonNotLoseService.ExecuteParallel(orderedAccounts, groupTickets, ticketStatusIds);
        }

        return await calculateRemainStatusService.ExecuteParallel(orderedAccounts, groupTickets, ticketStatusIds);
    }

    private static Dictionary<(int CustId, int StatusId), OrderedTickets> GroupTicketsByCustIdAndStatus(IEnumerable<TicketCalculateWinLostAccount> tickets)
    {
        return tickets.GroupBy(x => (x.CustId, x.StatusId))
            .ToDictionary(
                group => group.Key,
                group => new OrderedTickets
                {
                    Ascending = group.OrderBy(y => y.WinLost).ThenBy(y => y.IsVoid14),
                    TotalWinLost = group.Sum(y => y.WinLost)
                });
    }
}