using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Services.SubParlayTicket;

public interface TicketsService
{
    Task<IList<TicketModel>> GetTickets(string refNo, CancellationToken cancellationToken);

    IList<TicketViewModel> GetTickets(IList<TicketModel> tickets);

    string[] GetComboName(QueryComboParlay query);
}

public class TicketsServiceImp : TicketsService
{
    private readonly IDynamicRepository repository;
    private readonly BetListService betListService;

    public TicketsServiceImp(
        IDynamicRepository repository,
        BetListService betListService)
    {
        this.repository = repository;
        this.betListService = betListService;
    }

    public async Task<IList<TicketModel>> GetTickets(string refNo, CancellationToken cancellationToken)
    {
        var tickets = new List<TicketModel>();
        // Jacob Tương tự, xài Task.WhenAll và SelectMany
        foreach (var item in SiteDbGroupConstant.ServerList)
        {
            var criteria = new GetParlaySubBetCriteria
            {
                SiteDbGroupId = item.Id,
                RefNo = refNo
            };
            var result = await repository.FetchAsync<TicketModel>(criteria, cancellationToken);
            tickets.AddRange(result);
        }

        return tickets;
    }

    public IList<TicketViewModel> GetTickets(IList<TicketModel> tickets)
    {
        var ticketViewModels = new List<TicketViewModel>();
        foreach (var item in tickets)
        {
            var ticket = new TicketViewModel
            {
                SubTransId = item.TransId.ToString(),
                Choice = GetChoice(item)
            };
            ticketViewModels.Add(ticket);
        }

        return ticketViewModels;
    }

    private string GetChoice(TicketModel item)
    {
        var ticket = SetValue(item);
        var ticketHelper = new TicketHelper { IsShowOddsWithChoice = true };
        var choice = betListService.BuildChoice(ticket, ticketHelper, null, false);
        return ticket.StatusId == TicketStatus.VoidId ? $"<div class='strikethrough'>{choice}</div>" : choice;
    }

    private static Ticket SetValue(TicketModel item)
    {
        return new Ticket
        {
            TransId = item.TransId,
            BetTypeId = item.BetType,
            HomeId = item.HomeId,
            AwayId = item.AwayId,
            Handicap1 = item.Hdp1,
            Handicap2 = item.Hdp2,
            Odds = item.Odds,
            BetTeam = item.BetTeam,
            StatusId = item.StatusId,
            LiveHomeScore = item.LiveHomeScore,
            LiveAwayScore = item.LiveAwayScore,
            IsLive = item.LiveIndicator,
            LeagueId = item.LeagueId,
            SportTypeId = item.SportType,
            IsNeutral = item.IsNeutral,
            MatchId = item.MatchId,
            BetCheck = item.BetCheck,
            TransDesc = item.TransDesc,
            ShowTime = item.ShowTime,
            TransDate = item.TransDate
        };
    }

    public string[] GetComboName(QueryComboParlay query)
    {
        return betListService.GetComboName(query.BetTeam, query.BetCheck, query.Handicap1, query.Handicap2);
    }
}