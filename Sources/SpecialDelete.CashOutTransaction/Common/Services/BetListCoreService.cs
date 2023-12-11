using System.Globalization;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services.BetList;

namespace SpecialDelete.CashOutTransaction.Common.Services;

public interface BetListCoreService
{
    BetListTicket GetTicket(GetTicketModel item);
}

public class BetListCoreServiceImp : BetListCoreService
{
    private readonly IMapper mapper;
    private readonly BetListService betListService;

    public BetListCoreServiceImp(IMapper mapper, BetListService betListService)
    {
        this.mapper = mapper;
        this.betListService = betListService;
    }

    public BetListTicket GetTicket(GetTicketModel item)
    {
        var viewModel = new BetListTicket();
        var ticketHelper = new TicketHelper
        {
            ShowLeague = true,
            ShowMatch = true,
            ShowBetType = true
        };
        var ticket = SetTicket(item);
        var choiceBlock = betListService.BuildChoiceBlock(ticket, ticketHelper, null, false);
        var choiceBlockDetail = choiceBlock.BetType + choiceBlock.Match + choiceBlock.League;
        viewModel.Score = choiceBlock.Score ?? string.Empty;
        viewModel.Handicap = choiceBlock.Handicap.handicap;
        viewModel.Choice = betListService.GetBetTeam(choiceBlock) + choiceBlockDetail;
        viewModel.Stake = betListService.BuildStake(ticket, ticketHelper);
        viewModel.Odds = betListService.GetOdds(ticket, item.BetType.IsParlay());
        viewModel.BetTypeName = betListService.GetBetTypeName(ticket);
        viewModel.Status = betListService.GetStatus(ticket, ticketHelper, null, false);
        viewModel.Handicap = betListService.GetHandicap(ticket, ticketHelper, null, false);

        return viewModel;
    }

    private Ticket SetTicket(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.OddsType = item.OddsType.ToString(CultureInfo.InvariantCulture);
        ticket.Handicap1 = item.Hdp1;
        ticket.Handicap2 = item.Hdp2;
        ticket.IsLive = item.IsLiveIndicator;
        ticket.RefNo = item.RefNo.ToString(CultureInfo.InvariantCulture);

        return ticket;
    }
}