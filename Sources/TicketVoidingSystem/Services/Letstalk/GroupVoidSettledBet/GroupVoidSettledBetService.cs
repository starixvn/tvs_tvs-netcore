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
        try
        {
            return await Send(letstalkModel, ticketInfo, tickets);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(nameof(GroupVoidSettledBetService), exception);
            return new List<Result> { new() { ErrorCode = ErrorCode.SendLetstalkFail, ErrorMsg = exception.Message } };
        }
    }

    private async Task<IEnumerable<Result>> Send(LetstalkModel letstalkModel, TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets)
    {
        if (!tickets.Any())
        {
            return Enumerable.Empty<Result>();
        }

        var contents = messageContentService.Create(ticketInfo, tickets);
        if (!contents.Any())
        {
            return Enumerable.Empty<Result>();
        }

        return await SendMultipleMessage(letstalkModel, contents);
    }

    private async Task<IEnumerable<Result>> SendMultipleMessage(LetstalkModel letstalkModel, IEnumerable<string> contents)
    {
        var tasks = new List<Task<Result>>();
        foreach (var item in contents)
        {
            letstalkModel.Content = item;
            var task = letstalkSingleMessageService.Send(letstalkModel, null);
            tasks.Add(task);
        }

        var taskResults = await Task.WhenAll(tasks);

        return taskResults;
    }
}