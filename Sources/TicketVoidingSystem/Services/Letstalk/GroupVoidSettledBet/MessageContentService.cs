using System;
using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public interface MessageContentService
{
    IList<string> Create(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets);
}

public class MessageContentServiceImp : MessageContentService
{
    private const int MaxContent = 1024;
    private readonly UusTicketService uusTicketService;

    public MessageContentServiceImp(UusTicketService uusTicketService)
    {
        this.uusTicketService = uusTicketService;
    }

    public IList<string> Create(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        return model.IsMemberTemplate ? CreateMessageContentWithMemberTemplate(model, tickets) : CreateMessageContent(model, tickets);
    }

    private IList<string> CreateMessageContent(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        // Jacob, hàm này cũng đương đối phức tạp
        // Jacob: sử dụng ienumerable không đúng cũng có thể gây performance kém
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay && uusTicketService.IsValidSettledSingleTicket(ticket));
        var singleCount = singleTickets.Count(ticket => !ticket.IsInstantSettlementTicket);
        var instantOUCount = singleTickets.Count(ticket => ticket.IsInstantSettlementTicket);
        var cashOutCount = tickets.Count(uusTicketService.IsValidCashOut);
        var parlayCount = tickets.Count(ticket => uusTicketService.IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay));
        if (singleCount == 0 && parlayCount == 0 && cashOutCount == 0)
        {
            return new List<string>();
        }

        var matchEvent = model.Match.AwayId > 0 ? $"{model.Match.HomeName} - vs - {model.Match.AwayName}" : $"{model.Match.HomeName}";
        var content = $"Match ID: {model.Match.MatchId}{Environment.NewLine}"
                      + $"Event Date: {model.Match.EventDate:dd MMMM yyyy}{Environment.NewLine}"
                      + $"Kick Off: {model.Match.KickOffTime:h:mm tt}{Environment.NewLine}"
                      + $"League: {model.Match.LeagueName}{Environment.NewLine}"
                      + $"Match: {matchEvent}{Environment.NewLine}"
                      + $"Voided by: {model.UserName}{Environment.NewLine}"
                      + $"Void Time: {model.VoidFromTime} - {model.VoidToTime}"
                      + $"(Single Count: {singleCount}, Instant OU: {instantOUCount}, Cash Out: {cashOutCount}, Parlay Count: {parlayCount})";

        return new List<string> { content };
        // Jacob: Lúc nào cũng trả về 1 list string có 1 phần tử, vậy xài list làm gì
    }

    private IList<string> CreateMessageContentWithMemberTemplate(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        // Jacob: Hàm này cũng như hàm trên, khá phức tạp
        var singleTickets = tickets.Where(uusTicketService.IsValidSettledSingleTicket);
        var singleCount = singleTickets.Count(ticket => !ticket.IsInstantSettlementTicket);
        var instantOuCount = singleTickets.Count(ticket => ticket.IsInstantSettlementTicket);
        var cashOutCount = tickets.Count(uusTicketService.IsValidCashOut);
        var parlayCount = tickets.Count(ticket => uusTicketService.IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay));
        if (singleCount == 0 && parlayCount == 0 && cashOutCount == 0)
        {
            return new List<string>();
        }

        var outstandingSingleCount = tickets.Count(ticket => !ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsRunningOrWaiting());
        var outstandingParlayCount = tickets.Count(ticket => ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsRunningOrWaiting());
        var members = tickets.Where(ticket => ticket.Status.IsSettled()).Select(item => item.UserName).Distinct();
        var userNames = $"Username: {string.Join(", ", members)}";
        var content = $"Void Date: {model.VoidFromDate} - {model.VoidToDate}{Environment.NewLine}"
                      + $"Voided by: {model.UserName}"
                      + $"(Settled ticket: Single Count: {singleCount}, Instant OU: {instantOuCount}, Cash Out: {cashOutCount}, Parlay Count: {parlayCount}{Environment.NewLine}"
                      + $"Outstanding: Single Count: {outstandingSingleCount}, Parlay Count: {outstandingParlayCount}){Environment.NewLine}";

        return CreateMessageContentWithMemberTemplate(content, members, userNames);
    }

    private static IList<string> CreateMessageContentWithMemberTemplate(string content, IEnumerable<string> members, string userNames)
    {
        return content.Length + userNames.Length > MaxContent ? GenerateMultipleContent(content, members) : new List<string> { $"{content}{userNames}" };
    }

    private static IList<string> GenerateMultipleContent(string content, IEnumerable<string> members)
    {
        // Jacob: hàm phức tạp quá, thay vì đếm character, có thể nghĩ ra hướng: 1 content part bao gồm xxx member
        var results = new List<string>();
        var tempContent = $"{content}{Environment.NewLine}Username (p1): ";
        var contentPart = 1;
        var index = 0;
        foreach (var member in members)
        {
            if ($"{tempContent}, {member}".Length > MaxContent)
            {
                results.Add(tempContent);
                contentPart++;
                tempContent = $"Username (p{contentPart}): {Environment.NewLine}{member}";
            }
            else
            {
                tempContent = index == 0 ? $"{tempContent}{member}" : $"{tempContent}, {member}";
            }
            index++;
        }
        results.Add(tempContent);
        return results;
    }
}