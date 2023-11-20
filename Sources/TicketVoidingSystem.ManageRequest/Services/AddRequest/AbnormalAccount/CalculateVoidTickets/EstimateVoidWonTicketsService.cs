using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface EstimateVoidWonTicketsService
{
    bool IsCanNotRunAlgorithm(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit);

    IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit);
}

public class EstimateVoidWonTicketsServiceImp : EstimateVoidWonTicketsService
{
    private readonly KnapsackAlgorithmService knapsackAlgorithmService;
    private readonly SortAlgorithmService sortAlgorithmService;

    public EstimateVoidWonTicketsServiceImp(KnapsackAlgorithmService knapsackAlgorithmService, SortAlgorithmService sortAlgorithmService)
    {
        this.knapsackAlgorithmService = knapsackAlgorithmService;
        this.sortAlgorithmService = sortAlgorithmService;
    }

    public bool IsCanNotRunAlgorithm(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit)
    {
        return GetMaxCapacity(wonTickets, loseTickets, compareCredit) < 0;
    }

    private static decimal GetMaxCapacity(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit)
    {
        return compareCredit - (loseTickets.TotalWinLost - wonTickets.TotalWinLost);
    }

    public IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, OrderedTickets loseTickets, decimal compareCredit)
    {
        if (IsCanNotRunAlgorithm(wonTickets, loseTickets, compareCredit))
        {
            return Enumerable.Empty<TicketCalculateWinLostAccount>();
        }

        var maxCapacity = GetMaxCapacity(wonTickets, loseTickets, compareCredit);
        return AppSettingService.AppSetting.IsUseKnapsackAlgorithm
            ? knapsackAlgorithmService.Execute(wonTickets, maxCapacity) : sortAlgorithmService.Execute(wonTickets, maxCapacity);
    }
}