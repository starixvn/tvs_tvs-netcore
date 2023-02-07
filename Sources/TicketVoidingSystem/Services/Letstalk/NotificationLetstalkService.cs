using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.LetstalkService.Client;
using Fanex.LetstalkService.Core.Models;
using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk;

public interface NotificationLetstalkService
{
    Task<Result> Send(NotificationLetstalkModel model);

    Task<IEnumerable<Result>> Send(NotificationLetstalkModel model, IEnumerable<TicketEmailModel> tickets);
}

public class NotificationLetstalkServiceImp : NotificationLetstalkService
{
    private readonly IConfiguration configuration;
    private readonly LetstalkClientService letstalkService;
    private readonly LoggingService loggingService;
    private readonly bool isProdEnvForLetstalk;
    private const int maxContent = 1024;
    private const int currency20 = 20;

    public NotificationLetstalkServiceImp(IConfiguration configuration, LetstalkClientService letstalkService, LoggingService loggingService)
    {
        this.configuration = configuration;
        this.letstalkService = letstalkService;
        this.loggingService = loggingService;
        isProdEnvForLetstalk = Convert.ToBoolean(configuration.GetSection("Letstalk:IsProdEnv").Value);
    }

    public async Task<Result> Send(NotificationLetstalkModel model)
    {
        try
        {
            var letstalkResult = letstalkService.SendMessage(CreateLetstalkModelWithAttachmentFile(model));
            if (!letstalkResult)
            {
                return new Result
                {
                    ErrorCode = ErrorCode.SendLetstalkFail,
                    ErrorMsg = "Error when send message to Letstalk!!!"
                };
            }

            return new Result();
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception.Message);

            return new Result { ErrorCode = ErrorCode.SendLetstalkFail, ErrorMsg = exception.Message };
        }
    }

    public async Task<IEnumerable<Result>> Send(NotificationLetstalkModel model, IEnumerable<TicketEmailModel> tickets)
    {
        var results = new List<Result>();
        try
        {
            if (!tickets.Any())
            {
                return results;
            }
            var contents = model.IsMemberTemplate ? CreateMessageContentWithMemberTemplate(tickets, model) : CreateMessageContent(tickets, model);
            if (contents.Count == 0)
            {
                return results;
            }
            foreach (var item in contents)
            {
                var letstalkModel = CreateLetstalkModel(item);
                var letstalkResult = letstalkService.SendMessage(letstalkModel);
                if (!letstalkResult)
                {
                    results.Add(new Result { ErrorCode = ErrorCode.SendLetstalkFail, ErrorMsg = "Error when send message to Letstalk!!!" });
                }
            }
        }
        catch (Exception exception)
        {
            results.Add(new Result { ErrorCode = ErrorCode.SendLetstalkFail, ErrorMsg = exception.Message });
            await loggingService.ErrorAsync("", exception);
        }
        return results;
    }

    private List<string> CreateMessageContent(IEnumerable<TicketEmailModel> tickets, NotificationLetstalkModel model)
    {
        var singleTickets = tickets.Where(ticket => !ticket.IsMixParlay && IsValidSettledSingleTicket(ticket));
        var singleCount = singleTickets.Count(ticket => !ticket.IsInstantSettlementTicket);
        var instantOUCount = singleTickets.Count(ticket => ticket.IsInstantSettlementTicket);
        var cashOutCount = tickets.Count(IsValidCashOut);
        var parlayCount = tickets.Count(ticket => IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay));
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

    private List<string> CreateMessageContentWithMemberTemplate(IEnumerable<TicketEmailModel> tickets, NotificationLetstalkModel model)
    {
        var messages = new List<string>();
        var singleTickets = tickets.Where(IsValidSettledSingleTicket);
        var singleCount = singleTickets.Count(ticket => !ticket.IsInstantSettlementTicket);
        var instantOUCount = singleTickets.Count(ticket => ticket.IsInstantSettlementTicket);
        var cashOutCount = tickets.Count(IsValidCashOut);
        var parlayCount = tickets.Count(ticket => IsValidSettledParlayTicket(ticket, model.IsCheckMainParlay));
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
            messages.Add($"{content.ToString()}{userNames}");
        }
        return messages;
    }

    private LetstalkModel CreateLetstalkModel(string content)
    {
        return new LetstalkModel
        {
            TargetName = "Ticket-Voiding-System",
            Subject = "Void Settled Bet Notification",
            Content = content,
            Group = configuration.GetSection("Letstalk:VoidSettledBets").Value
        };
    }

    private bool IsValidCashOut(TicketEmailModel ticket)
    {
        if (isProdEnvForLetstalk)
        {
            return ticket.IsCashOut && ticket.Currency != currency20;
        }
        return ticket.IsCashOut;
    }

    private bool IsValidSettledSingleTicket(TicketEmailModel ticket)
    {
        var result = !ticket.BetTypeId.IsParlayAndBetBuilder()
                    && !ticket.IsCashOut
                    && ticket.Status.IsSettled();
        if (isProdEnvForLetstalk)
        {
            return result && ticket.Currency != currency20;
        }
        return result;
    }

    private bool IsValidSettledParlayTicket(TicketEmailModel ticket, bool isCheckMainParlay)
    {
        var result = isCheckMainParlay ? ticket.BetTypeId.IsParlayAndBetBuilder() && ticket.Status.IsSettled()
            : ticket.IsMixParlay && ticket.SubStatus.IsSettled();
        if (isProdEnvForLetstalk)
        {
            return result && ticket.Currency != currency20;
        }
        return result;
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

    private static LetstalkModel CreateLetstalkModelWithAttachmentFile(NotificationLetstalkModel model)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = model.TargetName,
            Subject = model.Subject,
            Content = model.Content,
            Group = model.Group
        };

        if (!string.IsNullOrWhiteSpace(model.FileName) && model.Attachment != null)
        {
            letstalkModel.LetstalkAttachments = new List<LetstalkAttachment>
                {
                    new LetstalkAttachment
                    {
                        FileName = model.FileName,
                        Bytes = model.Attachment
                    }
                };
        }

        return letstalkModel;
    }
}