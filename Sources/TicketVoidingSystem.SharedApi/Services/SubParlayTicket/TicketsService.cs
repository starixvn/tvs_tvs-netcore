using System.Collections.Generic;
using System.Linq;
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
    Task<IList<TicketModel>> GetTickets(string refNo);

    IList<TicketViewModel> GetTickets(IList<TicketModel> tickets);

    string[] GetComboName(QueryComboParlay query);
}

public class TicketsServiceImp(
    IDynamicRepository repository,
    BetListService betListService)
    : TicketsService
{
    public async Task<IList<TicketModel>> GetTickets(string refNo)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var criteria = new GetParlaySubBetCriteria
            {
                SiteDbGroupId = server.Id,
                RefNo = refNo
            };
            return repository.FetchAsync<TicketModel>(criteria);
        });
        var results = await Task.WhenAll(tasks);
        var tickets = results.SelectMany(result => result).ToList();

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