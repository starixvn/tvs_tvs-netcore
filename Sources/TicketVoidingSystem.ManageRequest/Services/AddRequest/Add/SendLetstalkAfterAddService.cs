using System.Text;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface SendLetstalkAfterAddService
{
    Task Execute(AddRequestQuery query, int requestId);
}

public class SendLetstalkAfterAddServiceImp : SendLetstalkAfterAddService
{
    private readonly SessionService sessionService;
    private readonly MatchService matchService;
    private readonly NotificationLetstalkService notificationLetstalkService;

    public SendLetstalkAfterAddServiceImp(SessionService sessionService, MatchService matchService, NotificationLetstalkService notificationLetstalkService)
    {
        this.sessionService = sessionService;
        this.matchService = matchService;
        this.notificationLetstalkService = notificationLetstalkService;
    }

    public async Task Execute(AddRequestQuery query, int requestId)
    {
        if (query is { IsHasUusTickets: false, IssueTypeId: IssueTypeConstant.AbnormalBet, SubIssueTypeId: SubIssueTypeConstant.FixGame or SubIssueTypeConstant.SystemFormulaBet })
        {
            var subject = CreateSubject(query);
            var content = await CreateContent(query, requestId);
            await notificationLetstalkService.SendToGroupAbnormalBetRequest(subject, content, null);
        }
    }

    private static string CreateSubject(AddRequestQuery query)
    {
        return query.FilterBy switch
        {
            FilterByConstant.MixParlay => "Add Request Abnormal Bet Notification - Mix Parlay",
            FilterByConstant.SystemParlay => "Add Request Abnormal Bet Notification - System Parlay",
            _ => "Add Request Abnormal Bet Notification"
        };
    }

    private async Task<string> CreateContent(AddRequestQuery query, int requestId)
    {
        var matchInfo = await GetMatch(query.MatchId ?? 0);
        var content = new StringBuilder();
        content.AppendLine($"Request ID: {requestId}");
        content.AppendLine($"Sub Issue Type: {query.SubIssueTypeName}");
        if (query.FilterBy != FilterByConstant.MixParlay && query.FilterBy != FilterByConstant.SystemParlay)
        {
            content.AppendLine($"Match ID: {query.MatchId}");
            content.AppendLine($"Event Date: {matchInfo.EventDate:dd MMMM yyyy}");
            content.AppendLine($"League: {matchInfo.LeagueName}");
            content.AppendLine($"Match: {matchInfo.MatchEvent}");
            content.AppendLine($"KO Time: {matchInfo.GlobalShowTime:hh:mm}");
            content.AppendLine($"Bet Type: {query.ListBettype}");
            content.AppendLine($"Bet Team: {query.ListBetteam}");
        }
        content.AppendLine($"Requested by: {sessionService.UserName}");

        return content.ToString();
    }

    private async Task<Match> GetMatch(int matchId)
    {
        var match = await matchService.GetMatch(matchId);
        return matchService.UpdateMatchInfoFromRemotingRef(match);
    }
}