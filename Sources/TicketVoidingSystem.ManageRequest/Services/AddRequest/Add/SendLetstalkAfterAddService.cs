using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface SendLetstalkAfterAddService
{
    Task Execute(AbnormalBetViewModel model, int requestId);
}

public class SendLetstalkAfterAddServiceImp : SendLetstalkAfterAddService
{
    private readonly SessionService sessionService;
    private readonly NotificationLetstalkService notificationLetstalkService;

    public SendLetstalkAfterAddServiceImp(SessionService sessionService, NotificationLetstalkService notificationLetstalkService)
    {
        this.sessionService = sessionService;
        this.notificationLetstalkService = notificationLetstalkService;
    }

    public async Task Execute(AbnormalBetViewModel model, int requestId)
    {
        if (model is { SubIssueTypeId: SubIssueTypeConstant.FixGame or SubIssueTypeConstant.SystemFormulaBet })
        {
            await SendLetstalk(model, requestId);
        }
    }

    private static string CreateSubject(AbnormalBetViewModel model)
    {
        return model.FilterBy switch
        {
            FilterByConstant.MixParlay => "Add Request Abnormal Bet Notification - Mix Parlay",
            FilterByConstant.SystemParlay => "Add Request Abnormal Bet Notification - System Parlay",
            _ => "Add Request Abnormal Bet Notification"
        };
    }

    private async Task SendLetstalk(AbnormalBetViewModel model, int requestId)
    {
        foreach (var sendLetstalkModel in model.SendLetstalkModels)
        {
            if (sendLetstalkModel.IsHasUusTickets)
            {
                continue;
            }
            var content = CreateContent(model, sendLetstalkModel, requestId);
            await notificationLetstalkService.SendToGroupAbnormalBetRequest(CreateSubject(model), content, null);
        }
    }

    private string CreateContent(AbnormalBetViewModel model, SendLetstalkModel sendLetstalkModel, int requestId)
    {
        var content = new StringBuilder();
        content.AppendLine($"Request ID: {requestId}");
        content.AppendLine($"Sub Issue Type: {model.SubIssueTypeName}");
        if (model.FilterBy != FilterByConstant.MixParlay && model.FilterBy != FilterByConstant.SystemParlay)
        {
            var matchInfo = model.Matches.First(x => x.MatchId == sendLetstalkModel.MatchId);
            content.AppendLine($"Match ID: {matchInfo.MatchId}");
            content.AppendLine($"Event Date: {matchInfo.EventDate:dd MMMM yyyy}");
            content.AppendLine($"League: {matchInfo.LeagueName}");
            content.AppendLine($"Match: {matchInfo.MatchEvent}");
            content.AppendLine($"KO Time: {matchInfo.GlobalShowTime:hh:mm}");
            content.AppendLine($"Bet Type: {sendLetstalkModel.ListBetType}");
            content.AppendLine($"Bet Team: {sendLetstalkModel.ListBetTeam}");
        }
        content.AppendLine($"Requested by: {sessionService.UserName}");

        return content.ToString();
    }
}