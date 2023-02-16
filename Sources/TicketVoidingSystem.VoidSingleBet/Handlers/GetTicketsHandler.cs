using Fanex.BetList.Core.Entities;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class GetTicketsRequest : GetTicketsQuery, IRequest<ListTicketsViewModel>
{
}

public class GetTicketsHandler : IRequestHandler<GetTicketsRequest, ListTicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;
    private readonly PagingService pagingService;
    private readonly BetListService betListService;

    public GetTicketsHandler(
        GetTicketsService getTicketsService,
        PagingService pagingService,
        BetListService betListService)
    {
        this.getTicketsService = getTicketsService;
        this.pagingService = pagingService;
        this.betListService = betListService;
    }

    public async Task<TicketsViewModel> Handle(GetTicketsRequest message)
    {
        var model = new TicketsViewModel();
        var data = await getTicketsService.GetTickets(message);
        var groups = GenerateGroup(data, message);
        var match = await getTicketsService.GetMatch(message.MatchId);
        foreach (var item in groups.Where(item => item.Tickets.Any()))
        {
            model.Groups.Add(getTicketsService.AssignData(item, match));
        }

        UpdateViewModel(model, data);

        return model;
    }

    private List<Group<GetTicketModel>> GenerateGroup(IEnumerable<GetTicketModel> data, GetTicketsRequest message)
    {
        var groups = new List<Group<GetTicketModel>>();
        var tickets = paggingService.Paging(data.ToList(), message.PageIndex, message.PageSize);
        if (!tickets.Any())
        {
            return groups;
        }
        var parlayTickets = tickets.Where(ticket => ticket.IsMixParlay).OrderBy(ticket => ticket.TransId).ToList();
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay).ToList();
        groups = paggingService.Groups(singleTickets, ticket => ticket.GroupName);
        groups.Add(new Group<GetTicketModel> { Name = "Parlay", Tickets = parlayTickets });

        return groups;
    }

    private void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        model.TotalItems = data.Count();
        var singleTickets = data.Where(item => !item.IsMixParlay).ToList();
        model.SingleCount = singleTickets.Count;
        var parlayTickets = data.Where(item => item.IsMixParlay).ToList();
        model.ParlayCount = parlayTickets.Count;
        var instantLicensee = data.Where(item => item.IsInstantSettlement && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var cashOutLicensee = data.Where(item => item.IsCashOut && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var chinaViewLicensee = data.Where(item => item.IsChinaView).Select(item => item.LicenseeName).Distinct().ToArray();
        var licensees = data.Where(item => item.IsDeposit && !chinaViewLicensee.Contains(item.LicenseeName)).Select(item => item.LicenseeName).Distinct().ToArray();

        Array.Sort(licensees, StringComparer.InvariantCulture);
        Array.Sort(instantLicensee, StringComparer.InvariantCulture);
        Array.Sort(cashOutLicensee, StringComparer.InvariantCulture);
        Array.Sort(chinaViewLicensee, StringComparer.InvariantCulture);
        model.LicenseesName = string.Join(", ", licensees);
        model.InstantLicenseesName = string.Join(", ", instantLicensee);
        model.CashOutLicenseesName = string.Join(", ", cashOutLicensee);
        model.ChinaViewLicenseesName = string.Join(", ", chinaViewLicensee);
        UpdateTimeViewModel(model, data);
        UpdateBetTypeName(model, data);
    }

    private static void UpdateTimeViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        if (!data.Any())
        {
            return;
        }
        model.FromTransTime = data.Min(item => item.TransDate).ZoneManila();
        model.ToTransTime = data.Max(item => item.TransDate).ZoneManila();

        model.FromCheckTime = data.Min(item => item.CheckTime).ZoneManila();
        model.ToCheckTime = data.Max(item => item.CheckTime).ZoneManila();
    }

    private void UpdateBetTypeName(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        if (!data.Any())
        {
            return;
        }

        var ticket = data.First().IsMixParlay ? CreateSubTicket(data.First()) : CreateTicket(data.First());
        model.BetTypeNameReplaceMessage = new TemplateContentModel
        {
            ContentEnglish = betListService.GetBetTypeName(ticket),
            ContentChineseTraditional = betListService.GetBetTypeNameChineseTraditional(ticket),
            ContentChineseSimplified = betListService.GetBetTypeNameSimplified(ticket),
            ContentNewChineseSimplified = betListService.GetBetTypeNameNewChineseSimplified(ticket),
        };
    }

    private static Ticket CreateTicket(GetTicketModel item)
    {
        var ticket = Mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.BetId = item.BetId;

        return ticket;
    }

    private static Ticket CreateSubTicket(GetTicketModel item)
    {
        var ticket = Mapper.Map<Ticket>(item);
        ticket.BetId = default(long?);
        ticket.OddsType = string.Empty;
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTypeId = item.SubBetType;
        ticket.BetTeam = item.SubBetTeam;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;

        return ticket;
    }
}