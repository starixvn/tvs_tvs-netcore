using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;

public interface GroupVoidSettledBetService
{
    Task<IEnumerable<Result>> SendMessageWithTicketInfo(LetstalkModel letstalkModel, TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets);
}

public class GroupVoidSettledBetServiceImp : GroupVoidSettledBetService
{
    private readonly MessageContentService messageContentService;
    private readonly LetstalkSingleMessageService letstalkSingleMessageService;
    private readonly LoggingService loggingService;

    public GroupVoidSettledBetServiceImp(MessageContentService messageContentService, LetstalkSingleMessageService letstalkSingleMessageService, LoggingService loggingService)
    {
        this.messageContentService = messageContentService;
        this.letstalkSingleMessageService = letstalkSingleMessageService;
        this.loggingService = loggingService;
    }

    public async Task<IEnumerable<Result>> SendMessageWithTicketInfo(LetstalkModel letstalkModel, TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets)
    {
        var results = new List<Result>();
        try
        {
            await Send(letstalkModel, ticketInfo, tickets, results);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(nameof(GroupVoidSettledBetService), exception);
            results.Add(new Result { ErrorCode = ErrorCode.SendLetstalkFail, ErrorMsg = exception.Message });
        }

        return results;
    }

    private async Task Send(LetstalkModel letstalkModel, TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets, ICollection<Result> results)
    {
        if (!tickets.Any())
        {
            return;
        }

        var contents = messageContentService.Create(ticketInfo, tickets);
        if (!contents.Any())
        {
            return;
        }

        await SendMultipleMessage(letstalkModel, contents, results);
    }

    private async Task SendMultipleMessage(LetstalkModel letstalkModel, IEnumerable<string> contents, ICollection<Result> results)
    {
        foreach (var item in contents)
        {
            letstalkModel.Content = item;
            var result = await letstalkSingleMessageService.Send(letstalkModel, null);

            results.Add(result);
        }
    }
}