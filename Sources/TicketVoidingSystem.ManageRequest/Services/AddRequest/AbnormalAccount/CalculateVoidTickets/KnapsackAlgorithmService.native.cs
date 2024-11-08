using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;

public interface KnapsackAlgorithmService
{
    IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, decimal maxCapacity);
}

public class KnapsackAlgorithmServiceImp : KnapsackAlgorithmService
{
    public IEnumerable<TicketCalculateWinLostAccount> Execute(OrderedTickets wonTickets, decimal maxCapacity)
    {
        var capacityMultiply100 = (int)(maxCapacity * 100) - 1;

        var weights = wonTickets.Descending.Select(x =>
        {
            x.WinLostMultiply100 = (int)(x.WinLost * 100);
            return x;
        }).ToList();

        var (_, selectedVoidItems) = Knapsack(capacityMultiply100, weights, weights);
        var voidWonTickets = selectedVoidItems.Select(index => wonTickets.Descending.ElementAt(index));

        return voidWonTickets;
    }

    private static (int maxWeight, IList<int> selectedItems) Knapsack(int capacity,
        IList<TicketCalculateWinLostAccount> weights, IList<TicketCalculateWinLostAccount> values)
    {
        var n = weights.Count;
        var dp = new int[capacity + 1];
        var selectedItems = new List<int>[capacity + 1];

        for (var i = 0; i <= capacity; i++)
        {
            selectedItems[i] = new List<int>();
        }

        for (var i = 1; i <= n; i++)
        {
            for (var w = capacity; w >= 0; w--)
            {
                if (weights[i - 1].WinLostMultiply100 <= w)
                {
                    var newValue = dp[w - weights[i - 1].WinLostMultiply100] + values[i - 1].WinLostMultiply100;
                    if (newValue > dp[w]) //NOSONAR
                    {
                        dp[w] = newValue;
                        selectedItems[w] = new List<int>(selectedItems[w - weights[i - 1].WinLostMultiply100]) { i - 1 };
                    }
                }
            }
        }

        return (dp[capacity], selectedItems[capacity]);
    }
}