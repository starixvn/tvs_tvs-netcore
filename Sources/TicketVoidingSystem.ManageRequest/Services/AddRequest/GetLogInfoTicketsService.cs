using System.Collections.Concurrent;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetLogInfoTicketsService
{
    TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request);
}

public class GetLogInfoTicketsServiceImp(
    MapTicketsService mapTicketsService,
    CompressDataService compressDataService,
    BetListService betListService,
    PagingService pagingService)
    : GetLogInfoTicketsService
{
    public TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request)
    {
        var getTicketModels = DecompressTickets(request.LogInfoTicketsJson);
        var voidTickets = getTicketModels?.Where(x => !x.IsCancelCashOut).ToList();

        if (voidTickets == null || voidTickets.Count == 0)
        {
            return new TicketsViewModel();
        }

        var stats = CalculateStats(voidTickets);
        var (affectedTickets, otherTickets, affectedGroupCounts, otherGroupCount) = GetCategoryTickets(voidTickets, request);
        var groupTicket = MapToGroupTicketViewModel(affectedTickets, request, affectedGroupCounts);
        var groupOtherTickets = MapToGroupTicketViewModel(otherTickets, request, otherGroupCount);

        return new TicketsViewModel
        {
            Total = stats.Total,
            TotalSingle = stats.TotalSingle,
            TotalParlay = stats.TotalParlay,
            Groups = groupTicket,
            IsHasSettledTicket = stats.HasSettled,
            FromTime = stats.FromTime,
            ToTime = stats.ToTime,
            GroupOtherTickets = groupOtherTickets
        };
    }

    private static (int Total, int TotalSingle, int TotalParlay, bool HasSettled, DateTime? FromTime, DateTime? ToTime)
        CalculateStats(List<GetTicketModel> tickets)
    {
        var total = 0;
        var totalSingle = 0;
        var totalParlay = 0;
        var hasSettled = false;
        DateTime? fromTime = null;
        DateTime? toTime = null;

        foreach (var ticket in tickets)
        {
            total++;
            if (ticket.IsMixParlay)
            {
                totalParlay++;
            }
            else
            {
                totalSingle++;
            }

            if (!hasSettled && ticket.IsSettledTicket())
            {
                hasSettled = true;
            }

            if (fromTime == null || ticket.TransDate < fromTime)
            {
                fromTime = ticket.TransDate;
            }

            if (toTime == null || ticket.TransDate > toTime)
            {
                toTime = ticket.TransDate;
            }
        }

        return (total, totalSingle, totalParlay, hasSettled, fromTime, toTime);
    }

    public (IEnumerable<GetTicketModel>, IEnumerable<GetTicketModel>, Dictionary<string, int> affectedGroupCounts, Dictionary<string, int> otherGroupCounts)
        GetCategoryTickets(List<GetTicketModel> voidTickets, GetLogInfoTicketsRequest request)
    {
        var normalTickets = new List<GetTicketModel>();
        var otherTickets = new List<GetTicketModel>();
        var normalGroupCounts = new Dictionary<string, int>();
        var otherGroupCounts = new Dictionary<string, int>();

        foreach (var ticket in voidTickets)
        {
            if (ticket.IsOtherTicket)
            {
                otherTickets.Add(ticket);
                otherGroupCounts.TryAdd(ticket.GroupName, 0);
                otherGroupCounts[ticket.GroupName]++;
            }
            else
            {
                normalTickets.Add(ticket);
                normalGroupCounts.TryAdd(ticket.GroupName, 0);
                normalGroupCounts[ticket.GroupName]++;
            }
        }

        if (!request.IssueTypeId.IsEarlyKickOffOrWrongKickOff())
        {
            return (normalTickets, otherTickets, normalGroupCounts, otherGroupCounts);
        }

        return (
            pagingService.Paging(normalTickets, request.PageIndex, request.PageSize),
            pagingService.Paging(otherTickets, request.PageIndex, request.PageSize),
            normalGroupCounts,
            otherGroupCounts
        );
    }

    public IEnumerable<GetTicketModel> DecompressTickets(string logInfoTicketsJsons)
    {
        var jsonItems = logInfoTicketsJsons.Split(',');
        var results = new ConcurrentBag<IEnumerable<GetTicketModel>>();

        Parallel.ForEach(jsonItems, json =>
        {
            var decompressed = compressDataService.DecompressTickets<GetTicketModel>(json);
            results.Add(decompressed);
        });

        return results.SelectMany(x => x)
            .OrderBy(x => x.GroupId)
            .ThenBy(x => x.TransId);
    }

    private IEnumerable<Group<TicketViewModel>> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> getTicketModels,
        GetLogInfoTicketsRequest request, Dictionary<string, int> groupCounts)
    {
        if (!getTicketModels.Any())
        {
            return [];
        }

        var grouped = getTicketModels.GroupBy(b => b.GroupName).ToList();

        var startIndex = request.PageIndex * request.PageSize + 1;
        var orderedGroups = grouped
            .OrderBy(g => g.Key == "Parlay")
            .ThenBy(g => g.Key)
            .ToList();

        return orderedGroups
            .Select(group => ToGroupTicket(group, request.IssueTypeId, groupCounts[group.Key], ref startIndex))
            .ToList();
    }

    private string GetSubBetType(GetTicketModel item)
    {
        var newTicket = new Ticket
        {
            BetTypeId = item.SubBetType,
            BetId = long.TryParse(item.SubBetCheck, out var betCheckNumber) ? betCheckNumber : null
        };

        return betListService.GetBetTypeName(newTicket);
    }

    private Group<TicketViewModel> ToGroupTicket(IGrouping<string, GetTicketModel> group, int issueTypeId, int groupCount, ref int startIndex)
    {
        return new Group<TicketViewModel>
        {
            Name = group.Key,
            Tickets = UpdateTicketViewModel(group, issueTypeId, ref startIndex),
            DisplayTotalTickets = groupCount
        };
    }

    private List<TicketViewModel> UpdateTicketViewModel(IEnumerable<GetTicketModel> tickets, int issueTypeId, ref int startIndex)
    {
        var results = new List<TicketViewModel>();
        foreach (var ticket in tickets)
        {
            var viewModel = mapTicketsService.MapFromGetTicketModelToTicketViewModel(ticket, null, ChoiceType.None, issueTypeId);
            viewModel.SubBetTypeId = (short)ticket.SubBetType;
            viewModel.SubBetType = ticket.IsMixParlay ? GetSubBetType(ticket) : string.Empty;
            viewModel.No = startIndex++;
            results.Add(viewModel);
        }

        return results;
    }
}