using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.Letstalk.GroupAbnormalBetRequest;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk;

public interface NotificationLetstalkService
{
    Task<IEnumerable<Result>> SendToGroupVoidSettledBets(TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets);

    Task<Result> SendToGroupTicketListing(string content, LetstalkAttachment attachment);

    Task<Result> SendToGroupTicketListing777(string content, LetstalkAttachment attachment);

    Task<Result> SendToGroupAbnormalBetRequest(string subject, string content, LetstalkAttachment attachment);
}

public class NotificationLetstalkServiceImp : NotificationLetstalkService
{
    private readonly GroupVoidSettledBetService groupVoidSettledBetService;
    private readonly GroupTicketListingService groupTicketListingService;
    private readonly GroupAbnormalBetRequestService groupAbnormalBetRequestService;
    private const string TargetName = "Ticket-Voiding-System";

    public NotificationLetstalkServiceImp(GroupVoidSettledBetService groupVoidSettledBetService,
        GroupTicketListingService groupTicketListingService, GroupAbnormalBetRequestService groupAbnormalBetRequestService)
    {
        this.groupVoidSettledBetService = groupVoidSettledBetService;
        this.groupTicketListingService = groupTicketListingService;
        this.groupAbnormalBetRequestService = groupAbnormalBetRequestService;
    }

    public async Task<IEnumerable<Result>> SendToGroupVoidSettledBets(TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Subject = "Void Settled Bet Notification",
            Group = AppSettingService.AppSetting.LetstalkConfig.VoidSettledBets
        };

        return await groupVoidSettledBetService.SendMessageWithTicketInfo(letstalkModel, ticketInfo, tickets);
    }

    public async Task<Result> SendToGroupTicketListing(string content, LetstalkAttachment attachment)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Content = content,
            Subject = "Result Amendment Notification - Credit",
            Group = AppSettingService.AppSetting.LetstalkConfig.TicketListingAlert
        };

        return await groupTicketListingService.SendMessage(letstalkModel, attachment);
    }

    public async Task<Result> SendToGroupTicketListing777(string content, LetstalkAttachment attachment)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Content = content,
            Subject = "Result Amendment Notification - Credit (777)",
            Group = AppSettingService.AppSetting.LetstalkConfig.TicketListingAlert777
        };

        return await groupTicketListingService.SendMessage(letstalkModel, attachment);
    }

    public async Task<Result> SendToGroupAbnormalBetRequest(string subject, string content, LetstalkAttachment attachment)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Subject = subject,
            Group = AppSettingService.AppSetting.LetstalkConfig.AbnormalBetRequest,
            Content = content
        };

        return await groupAbnormalBetRequestService.SendMessage(letstalkModel, attachment);
    }
}