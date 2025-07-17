using System;
using System.Collections.Generic;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public interface MessageContentWithMemberTemplateService
{
    IList<string> Create(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets);
}

public class MessageContentWithMemberTemplateServiceImp(ValidationTicketService validationTicketService)
    : MessageContentWithMemberTemplateService
{
    private const int MaxContent = 1024;

    public IList<string> Create(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        var countInfo = CountTicketTypes(model, tickets);
        if (countInfo.SingleCount == 0 && countInfo.ParlayCount == 0 && countInfo.CashOutCount == 0)
        {
            return new List<string>();
        }

        var userNames = $"Username: {string.Join(", ", countInfo.Members)}";
        var content = $"Void Date: {model.VoidFromDate} - {model.VoidToDate}{Environment.NewLine}"
                      + $"Voided by: {model.UserName}"
                      + $"(Settled ticket: Single Count: {countInfo.SingleCount}, Instant OU: {countInfo.InstantOUCount}"
                      + $", Cash Out: {countInfo.CashOutCount}, Parlay Count: {countInfo.ParlayCount}{Environment.NewLine}"
                      + $"Outstanding: Single Count: {countInfo.OutstandingSingleCount}, Parlay Count: {countInfo.OutstandingParlayCount}){Environment.NewLine}";

        return CreateMessageContentWithMemberTemplate(content, countInfo.Members, userNames);
    }

    private TicketCountInfo CountTicketTypes(TicketInfoForLetstalk model, IEnumerable<TicketEmailModel> tickets)
    {
        var countInfo = new TicketCountInfo();

        foreach (var ticket in tickets)
        {
            UpdateCountSingleInstant(countInfo, ticket);

            if (validationTicketService.IsValidCashOut(ticket))
            {
                countInfo.CashOutCount++;
            }
            if (validationTicketService.IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay))
            {
                countInfo.ParlayCount++;
            }
            if (!ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsRunningOrWaiting())
            {
                countInfo.OutstandingSingleCount++;
            }
            if (ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsRunningOrWaiting())
            {
                countInfo.OutstandingParlayCount++;
            }
            if (ticket.Status.IsSettled())
            {
                countInfo.Members.Add(ticket.UserName);
            }
        }

        return countInfo;
    }

    private void UpdateCountSingleInstant(TicketCountInfo countInfo, TicketEmailModel ticket)
    {
        if (!validationTicketService.IsValidSettledSingleTicket(ticket))
        {
            return;
        }

        if (!ticket.IsInstantSettlementTicket)
        {
            countInfo.SingleCount++;
        }
        else
        {
            countInfo.InstantOUCount++;
        }
    }

    private static IList<string> CreateMessageContentWithMemberTemplate(string content, IEnumerable<string> members, string userNames)
    {
        return content.Length + userNames.Length > MaxContent ? GenerateMultipleContent(content, members) : new List<string> { $"{content}{userNames}" };
    }

    private static IList<string> GenerateMultipleContent(string content, IEnumerable<string> members)
    {
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