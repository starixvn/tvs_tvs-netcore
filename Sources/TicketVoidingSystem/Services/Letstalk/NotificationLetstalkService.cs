using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk;

public interface NotificationLetstalkService
{
    Task<IEnumerable<Result>> SendToGroupVoidSettledBets(TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets);

    Task<Result> SendToGroupTicketListing(string content, LetstalkAttachment attachment);

    Task<Result> SendToGroupAbnormalBetRequest(LetstalkModel model, LetstalkAttachment attachment);
}

public class NotificationLetstalkServiceImp : NotificationLetstalkService
{
    private readonly GroupVoidSettledBetService groupVoidSettledBetService;
    private readonly GroupTicketListingService groupTicketListingService;
    private readonly IConfiguration configuration;

    public NotificationLetstalkServiceImp(GroupVoidSettledBetService groupVoidSettledBetService, GroupTicketListingService groupTicketListingService,
        IConfiguration configuration)
    {
        this.groupVoidSettledBetService = groupVoidSettledBetService;
        this.groupTicketListingService = groupTicketListingService;
        this.configuration = configuration;
    }

    public async Task<IEnumerable<Result>> SendToGroupVoidSettledBets(TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = "Ticket-Voiding-System",
            Subject = "Void Settled Bet Notification",
            Group = configuration.GetSection("Letstalk:VoidSettledBets").Value
        };

        return await groupVoidSettledBetService.SendMessageWithTicketInfo(letstalkModel, ticketInfo, tickets);
    }

    public async Task<Result> SendToGroupTicketListing(string content, LetstalkAttachment attachment)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = "Ticket-Voiding-System",
            Subject = "Result Amendment Notification - Credit",
            Group = configuration.GetSection("Letstalk:TicketListingAlert").Value
        };

        return await groupTicketListingService.SendMessage(letstalkModel, content, attachment);
    }

    public Task<Result> SendToGroupAbnormalBetRequest(LetstalkModel model, LetstalkAttachment attachment)
    {
        throw new NotImplementedException();
    }
}