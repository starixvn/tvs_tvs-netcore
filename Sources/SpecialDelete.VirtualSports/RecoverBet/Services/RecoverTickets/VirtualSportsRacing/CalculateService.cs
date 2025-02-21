using Settlement.Business.Core.Models;
using Settlement.Business.Services;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Constants;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface CalculateService
{
    Task<List<TicketsBetTransModel>> ResetToRunning(List<TicketsBetTransModel> tickets);
}

public class CalculateServiceImp(MatchService matchService,
    GenerateSettleTicketService generateSettleTicketService) : CalculateService
{
    public async Task<List<TicketsBetTransModel>> ResetToRunning(List<TicketsBetTransModel> tickets)
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

        return await Task.FromResult(tickets);
    }

    public async Task<List<TicketsBetTransModel>> Settle(List<TicketsBetTransModel> tickets)
    {
        var (_, outright, resources) = await matchService.GetRacingInfo(1);
        var ticketsAfterCalculate = generateSettleTicketService.Calc(tickets.Cast<Ticket>().ToList(), outright.ToList(), resources.ToList());

        // something

        return new List<TicketsBetTransModel>();
    }

    public async Task<List<TicketsBetTransModel>> Refund(List<TicketsBetTransModel> tickets)
    {
        var ticketsAfterRefund = generateSettleTicketService.Refund(tickets.Cast<Ticket>().ToList());

        // something

        return new List<TicketsBetTransModel>();
    }
}