using System;
using System.Collections.Generic;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public interface MessageContentSingleService
{
    string Create(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets);
}

public class MessageContentSingleServiceImp : MessageContentSingleService
{
    private readonly UusTicketService uusTicketService;

    public MessageContentSingleServiceImp(UusTicketService uusTicketService)
    {
        this.uusTicketService = uusTicketService;
    }

    public string Create(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        var countInfo = CountTicketTypes(model, tickets);
        if (countInfo.SingleCount == 0 && countInfo.ParlayCount == 0 && countInfo.CashOutCount == 0)
        {
            return string.Empty;
        }

        var matchEvent = model.Match.AwayId > 0 ? $"{model.Match.HomeName} - vs - {model.Match.AwayName}" : $"{model.Match.HomeName}";

        return $"Match ID: {model.Match.MatchId}{Environment.NewLine}"
               + $"Event Date: {model.Match.EventDate:dd MMMM yyyy}{Environment.NewLine}"
               + $"Kick Off: {model.Match.KickOffTime:h:mm tt}{Environment.NewLine}"
               + $"League: {model.Match.LeagueName}{Environment.NewLine}"
               + $"Match: {matchEvent}{Environment.NewLine}"
               + $"Voided by: {model.UserName}{Environment.NewLine}"
               + $"Void Time: {model.VoidFromTime} - {model.VoidToTime}"
               + $"(Single Count: {countInfo.SingleCount}, Instant OU: {countInfo.InstantOUCount}, Cash Out: {countInfo.CashOutCount}, Parlay Count: {countInfo.ParlayCount})";
    }

    private TicketCountInfo CountTicketTypes(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        var countInfo = new TicketCountInfo();
        foreach (var ticket in tickets)
        {
            if (!ticket.IsMixParlay && uusTicketService.IsValidSettledSingleTicket(ticket))
            {
                countInfo.InstantOUCount += ticket.IsInstantSettlementTicket ? 1 : 0;
                countInfo.SingleCount += !ticket.IsInstantSettlementTicket ? 1 : 0;
            }

            countInfo.CashOutCount += uusTicketService.IsValidCashOut(ticket) ? 1 : 0;
            countInfo.ParlayCount += uusTicketService.IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay) ? 1 : 0;
        }

        return countInfo;
    }
}