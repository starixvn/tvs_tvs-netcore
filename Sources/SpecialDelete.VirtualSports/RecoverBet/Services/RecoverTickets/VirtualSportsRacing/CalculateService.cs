using Settlement.Business.Core.Constants;
using Settlement.Business.Core.Models;
using Settlement.Business.Services;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Constants;
using static Settlement.Business.Core.Constants.Status;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface CalculateService
{
    List<TicketsBetTransModel> ResetToRunning(List<TicketsBetTransModel> tickets);

    Task<List<TicketsBetTransModel>> Settle(List<TicketsBetTransModel> tickets, List<Outright> outright, List<Resources> resources);

    List<TicketsBetTransModel> Refund(List<TicketsBetTransModel> tickets);
}

public class CalculateServiceImp(ModdsService moddsService, TicketValueService ticketValueService, WinLimitService winLimitService) : CalculateService
{
    public List<TicketsBetTransModel> ResetToRunning(List<TicketsBetTransModel> tickets)
    {
        foreach (var ticket in tickets)
        {
            ticket.StatusWinLost = null;
            ticket.WinLost = 0;
            ticket.Status = TicketStatus.Running;
            ticket.StatusId = TicketStatus.RunningId;
            ticket.Ruben = 0;
            ticket.Creator = ticket.CreatorBackUp;
        }

        return tickets;
    }

    public List<TicketsBetTransModel> Refund(List<TicketsBetTransModel> tickets)
    {
        tickets.ForEach(item =>
        {
            item.WinLost = item.ActualStake;
            item.AWinLost = 0;
            item.MWinLost = 0;
            item.SWinLost = 0;
            item.PlayerComm = 0;
            item.Comm = 0;
            item.AComm = 0;
            item.SComm = 0;
            item.Ruben = Ruben.Default;
            item.StatusWinLost = StatusWinlost.Refund;
            item.StatusId = StatusId.Refund;
            item.Status = StatusName.Refund;
        });

        return tickets;
    }

    public async Task<List<TicketsBetTransModel>> Settle(List<TicketsBetTransModel> tickets, List<Outright> outright, List<Resources> resources)
    {
        tickets.ForEach(item =>
        {
            var resource = resources.Find(r => r.ProfileId == item.ProfileId) ?? new Resources();
            item.Modds = moddsService.VirtualRacing(item, outright.ToList());
            item.OddsType = resource.OddsType;
            item.ActualPayout = ticketValueService.GetActualPayout(item.Modds, item.Odds, item.OddsType, item.ActualStake, item.Stake);
        });
        var maxWinLimit = (await winLimitService.GetMaxWinLimit(tickets)).ToList();

        tickets.ForEach(item => ticketValueService.SetValue(item, maxWinLimit));

        return tickets;
    }
}