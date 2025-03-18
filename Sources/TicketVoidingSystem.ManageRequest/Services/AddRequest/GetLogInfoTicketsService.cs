using System.Collections.Concurrent;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetLogInfoTicketsService
{
    public TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request);
}

public class GetLogInfoTicketsServiceImp(MapTicketsService mapTicketsService, CompressDataService compressDataService, BetListService betListService)
    : GetLogInfoTicketsService
{
    public TicketsViewModel GetTicketsViewModel(GetLogInfoTicketsRequest request)
    {
        var getTicketModels = DecompressTickets(request.LogInfoTicketsJson);
        var voidTickets = getTicketModels?.Where(x => !x.IsCancelCashOut);

        if (!voidTickets.Any())
        {
            return new TicketsViewModel();
        }

        var affectedTickets = voidTickets.Where(x => !x.IsOtherTicket);
        var otherTickets = voidTickets.Where(x => x.IsOtherTicket);
        var groupTicket = MapToGroupTicketViewModel(affectedTickets, request.IssueTypeId);
        var groupOtherTickets = MapToGroupTicketViewModel(otherTickets, request.IssueTypeId);

        var viewModel = new TicketsViewModel
        {
            TotalSingle = voidTickets.Count(ticket => !ticket.IsMixParlay),
            TotalParlay = voidTickets.Count(ticket => ticket.IsMixParlay),
            Groups = groupTicket,
            IsHasSettledTicket = voidTickets.Any(ticket => ticket.IsSettledTicket()),
            FromTime = voidTickets.Min(ticket => ticket.TransDate),
            ToTime = voidTickets.Max(ticket => ticket.TransDate),
            GroupOtherTickets = groupOtherTickets
        };
        return viewModel;
    }

    public IEnumerable<GetTicketModel> DecompressTickets(string logInfoTicketsJsons)
    {
        var jsonItems = logInfoTicketsJsons.Split(",");
        var results = new ConcurrentBag<IEnumerable<GetTicketModel>>();

        Parallel.ForEach(jsonItems, json =>
        {
            var decompressed = compressDataService.DecompressTickets<GetTicketModel>(json);
            results.Add(decompressed);
        });

        return results.SelectMany(x => x);
    }

    private IEnumerable<Group<TicketViewModel>> MapToGroupTicketViewModel(IEnumerable<GetTicketModel> getTicketModels, int issueTypeId)
    {
        if (!getTicketModels.Any())
        {
            return [];
        }

        return getTicketModels.GroupBy(b => b.GroupName)
            .Select(x => ToGroupTicket(x, issueTypeId))
            .OrderBy(group => group.Name == "Parlay")
            .ThenBy(group => group.Name);
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

    private Group<TicketViewModel> ToGroupTicket(IGrouping<string, GetTicketModel> group, int issueTypeId)
    {
        return new Group<TicketViewModel>
        {
            Name = group.Key,
            Tickets = UpdateTicketVideModel(group.ToList(), issueTypeId),
            DisplayTotalTickets = group.Count()
        };
    }

    private IEnumerable<TicketViewModel> UpdateTicketVideModel(IEnumerable<GetTicketModel> tickets, int issueTypeId)
    {
        var index = 1;
        return tickets.Select(ticket =>
        {
            var ticketViewModel = mapTicketsService.MapFromGetTicketModelToTicketViewModel(ticket, null, ChoiceType.None, issueTypeId);
            ticketViewModel.SubBetTypeId = (short)ticket.SubBetType;
            ticketViewModel.SubBetType = ticket.IsMixParlay ? GetSubBetType(ticket) : string.Empty;
            ticketViewModel.No = index++;

            return ticketViewModel;
        });
    }
}