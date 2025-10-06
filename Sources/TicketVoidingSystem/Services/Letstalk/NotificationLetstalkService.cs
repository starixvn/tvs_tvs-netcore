using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.LetstalkService.Client.Models;
using TicketVoidingSystem.Constants;
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

    Task<Result> SendToGroupTicketListing(string content, LetstalkAttachment attachment, bool isAllUusTicket);

    Task<Result> SendToGroupTicketListing777(string content, LetstalkAttachment attachment, bool isAllUusTicket);

    Task<Result> SendToGroupAbnormalBetRequest(string subject, string content, bool isAllUusTicket);
}

public class NotificationLetstalkServiceImp(
    GroupVoidSettledBetService groupVoidSettledBetService,
    GroupTicketListingService groupTicketListingService,
    GroupAbnormalBetRequestService groupAbnormalBetRequestService)
    : NotificationLetstalkService
{
    private const string TargetName = "Ticket-Voiding-System";

    public async Task<IEnumerable<Result>> SendToGroupVoidSettledBets(TicketInfoForLetstalk ticketInfo, IEnumerable<TicketEmailModel> tickets)
    {
        var isAllUusTicket = tickets.All(ticket => ticket.Currency is CurrencyConstant.UusId);
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Subject = "Void Settled Bet Notification",
            Group = GroupFactory.GetGroup(LetstalkGroupType.VoidSettledBets, isAllUusTicket)
        };

        return await groupVoidSettledBetService.SendMessageWithTicketInfo(letstalkModel, ticketInfo, tickets);
    }

    public async Task<Result> SendToGroupTicketListing(string content, LetstalkAttachment attachment, bool isAllUusTicket)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Content = content,
            Subject = "Result Amendment Notification - Credit",
            Group = GroupFactory.GetGroup(LetstalkGroupType.TicketListingAlert, isAllUusTicket)
        };

        return await groupTicketListingService.SendMessage(letstalkModel, attachment);
    }

    public async Task<Result> SendToGroupTicketListing777(string content, LetstalkAttachment attachment, bool isAllUusTicket)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Content = content,
            Subject = "Result Amendment Notification - Credit (777)",
            Group = GroupFactory.GetGroup(LetstalkGroupType.TicketListingAlert777, isAllUusTicket)
        };

        return await groupTicketListingService.SendMessage(letstalkModel, attachment);
    }

    public async Task<Result> SendToGroupAbnormalBetRequest(string subject, string content, bool isAllUusTicket)
    {
        var letstalkModel = new LetstalkModel
        {
            TargetName = TargetName,
            Content = content,
            Subject = subject,
            Group = GroupFactory.GetGroup(LetstalkGroupType.AbnormalBetRequest, isAllUusTicket)
        };

        return await groupAbnormalBetRequestService.SendMessage(letstalkModel, null);
    }
}