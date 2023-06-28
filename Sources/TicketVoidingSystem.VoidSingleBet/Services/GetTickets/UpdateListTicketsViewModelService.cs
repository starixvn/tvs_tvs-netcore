using AutoMapper;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface UpdateListTicketsViewModelService
{
    void Update(ListTicketsViewModel model, IList<GetTicketModel> data);
}

public class UpdateListTicketsViewModelServiceImp : UpdateListTicketsViewModelService
{
    private readonly IMapper mapper;
    private readonly BetListService betListService;

    public UpdateListTicketsViewModelServiceImp(IMapper mapper, BetListService betListService)
    {
        this.mapper = mapper;
        this.betListService = betListService;
    }

    public void Update(ListTicketsViewModel model, IList<GetTicketModel> data)
    {
        if (!data.Any())
        {
            return;
        }

        model.TotalItems = data.Count;
        var singleTickets = data.Where(item => !item.IsMixParlay);
        model.SingleCount = singleTickets.Count();
        var parlayTickets = data.Where(item => item.IsMixParlay);
        model.ParlayCount = parlayTickets.Count();

        UpdateLicenseesViewModel(model, data);
        UpdateTimeViewModel(model, data);
        UpdateBetTypeName(model, data);
    }

    private static void UpdateLicenseesViewModel(ListTicketsViewModel model, IList<GetTicketModel> data)
    {
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
    }

    private static void UpdateTimeViewModel(ListTicketsViewModel model, IList<GetTicketModel> data)
    {
        model.FromTransTime = data.Min(item => item.TransDate).ZoneManila();
        model.ToTransTime = data.Max(item => item.TransDate).ZoneManila();
        model.FromCheckTime = data.Min(item => item.CheckTime).ZoneManila();
        model.ToCheckTime = data.Max(item => item.CheckTime).ZoneManila();
    }

    private void UpdateBetTypeName(ListTicketsViewModel model, IList<GetTicketModel> data)
    {
        var ticket = data.First().IsMixParlay ? CreateSubTicketBetList(data.First()) : CreateTicketBetList(data.First());
        model.BetTypeNameReplaceMessage = new TemplateContentModel
        {
            ContentEnglish = betListService.GetBetTypeName(ticket),
            ContentChineseTraditional = betListService.GetBetTypeNameChineseTraditional(ticket),
            ContentChineseSimplified = betListService.GetBetTypeNameChineseSimplified(ticket),
            ContentNewChineseSimplified = betListService.GetBetTypeNameNewChineseSimplified(ticket)
        };
    }

    private Ticket CreateTicketBetList(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.BetId = item.BetId;

        return ticket;
    }

    private Ticket CreateSubTicketBetList(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetId = default;
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