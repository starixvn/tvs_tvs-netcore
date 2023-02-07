using System.Collections.Generic;
using System.Linq;
using System.Text;
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
    private const int maxContent = 1024;
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
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay && uusTicketService.IsValidSettledSingleTicket(ticket));
        var singleCount = singleTickets.Count(ticket => !ticket.IsInstantSettlementTicket);
        var instantOUCount = singleTickets.Count(ticket => ticket.IsInstantSettlementTicket);
        var cashOutCount = tickets.Count(uusTicketService.IsValidCashOut);
        var parlayCount = tickets.Count(ticket => uusTicketService.IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay));
        if (singleCount == 0 && parlayCount == 0 && cashOutCount == 0)
        {
            return new List<string>();
        }
        model.SingleCount = singleCount;
        model.InstantOUCount = instantOUCount;
        model.ParlayCount = parlayCount;
        model.CashOutCount = cashOutCount;
        var matchEvent = model.Match.AwayId > 0 ? $"{model.Match.HomeName} - vs - {model.Match.AwayName}" : $"{model.Match.HomeName}";
        var content = new StringBuilder();
        content.AppendLine($"Match ID: {model.Match.MatchId}");
        content.AppendLine($"Event Date: {model.Match.EventDate:dd MMMM yyyy}");
        content.AppendLine($"Kick Off: {model.Match.KickOffTime:h:mm tt}");
        content.AppendLine($"League: {model.Match.LeagueName}");
        content.AppendLine($"Match: {matchEvent}");
        content.AppendLine($"Voided by: {model.UserName}");
        content.AppendLine($"Void Time: {model.VoidFromTime} - {model.VoidToTime}");
        content.Append($"(Single Count: {model.SingleCount}, Instant OU: {model.InstantOUCount}, Cash Out: {model.CashOutCount}, Parlay Count: {model.ParlayCount})");
        return new List<string> { content.ToString() };
    }

    private IList<string> CreateMessageContentWithMemberTemplate(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        var messages = new List<string>();
        var singleTickets = tickets.Where(uusTicketService.IsValidSettledSingleTicket);
        var singleCount = singleTickets.Count(ticket => !ticket.IsInstantSettlementTicket);
        var instantOUCount = singleTickets.Count(ticket => ticket.IsInstantSettlementTicket);
        var cashOutCount = tickets.Count(uusTicketService.IsValidCashOut);
        var parlayCount = tickets.Count(ticket => uusTicketService.IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay));
        if (singleCount == 0 && parlayCount == 0 && cashOutCount == 0)
        {
            return new List<string>();
        }
        model.SingleCount = singleCount;
        model.InstantOUCount = instantOUCount;
        model.CashOutCount = cashOutCount;
        model.ParlayCount = parlayCount;
        model.OutstandingSingleCount = tickets.Count(ticket => !ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsRunningOrWaiting());
        model.OutstandingParlayCount = tickets.Count(ticket => ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsRunningOrWaiting());
        var members = tickets.Where(ticket => ticket.Status.IsSettled()).Select(item => item.UserName).Distinct();
        var userNames = $"Username: {string.Join(", ", members)}";

        var content = new StringBuilder();
        content.AppendLine($"Void Date: {model.VoidFromDate} - {model.VoidToDate}");
        content.AppendLine($"Voided by: {model.UserName}");
        content.AppendLine($"(Settled ticket: Single Count: {model.SingleCount}, Instant OU: {model.InstantOUCount}, Cash Out: {model.CashOutCount}, Parlay Count: {model.ParlayCount}");
        content.AppendLine($"Outstanding: Single Count: {model.OutstandingSingleCount}, Parlay Count: {model.OutstandingParlayCount})");

        if ($"{content}{userNames}".Length > maxContent)
        {
            messages.AddRange(GenerateMultipleContent(content, members));
        }
        else
        {
            messages.Add($"{content}{userNames}");
        }
        return messages;
    }

    private static IEnumerable<string> GenerateMultipleContent(StringBuilder content, IEnumerable<string> members)
    {
        var results = new List<string>();
        content.AppendLine("Username (p1): ");
        var tempContent = content.ToString();
        var patch = 1;
        var index = 0;
        foreach (var member in members)
        {
            if ($"{tempContent}, {member}".Length > maxContent)
            {
                results.Add(tempContent);
                patch++;
                tempContent = $"Username (p{patch}): \r\n{member}";
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