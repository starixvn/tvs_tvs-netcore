using AutoMapper;
using Settlement.Business.Core.Models;
using Settlement.Business.Services;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Constants;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface CalculateService
{
    IEnumerable<TicketsBetTransModel> ResetToRunning(IEnumerable<TicketsBetTransModel> tickets);

    Task<IEnumerable<TicketsBetTransModel>> Settle(IEnumerable<TicketsBetTransModel> tickets, IEnumerable<Outright> outright, IEnumerable<Resources> resources);

    IEnumerable<TicketsBetTransModel> Refund(IEnumerable<TicketsBetTransModel> tickets);
}

public class CalculateServiceImp(MatchService matchService, IMapper mapper,
    GenerateSettleTicketService generateSettleTicketService) : CalculateService
{
    public IEnumerable<TicketsBetTransModel> ResetToRunning(IEnumerable<TicketsBetTransModel> tickets)
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

    public async Task<IEnumerable<TicketsBetTransModel>> Settle(IEnumerable<TicketsBetTransModel> tickets, IEnumerable<Outright> outright, IEnumerable<Resources> resources)
    {
        var ticketsAfterCalculate = await generateSettleTicketService.Calc(mapper.Map<List<Ticket>>(tickets), outright.ToList(), resources.ToList());

        return mapper.Map<List<TicketsBetTransModel>>(ticketsAfterCalculate);
    }

    public IEnumerable<TicketsBetTransModel> Refund(IEnumerable<TicketsBetTransModel> tickets)
    {
        var ticketsAfterRefund = generateSettleTicketService.Refund(mapper.Map<List<Ticket>>(tickets));

        return mapper.Map<IEnumerable<TicketsBetTransModel>>(ticketsAfterRefund);
    }
}