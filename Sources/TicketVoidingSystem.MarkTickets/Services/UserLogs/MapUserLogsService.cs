using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Services.UserLogs;

public interface MapUserLogsService
{
    IEnumerable<GetUserLogViewModel> MapToUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs, UserLogTicketInfo ticketInfo);
}

public class MapUserLogsServiceImp : MapUserLogsService
{
    private readonly RemotingRefWrapperService remotingRefService;

    public MapUserLogsServiceImp(RemotingRefWrapperService remotingRefService)
    {
        this.remotingRefService = remotingRefService;
    }

    public IEnumerable<GetUserLogViewModel> MapToUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs, UserLogTicketInfo ticketInfo)
    {
        var index = 1;
        return originalLogs.Select(log => new GetUserLogViewModel
        {
            No = index++,
            ActionId = log.SessionId,
            LogDate = log.CreatedDate,
            Action = UpdateAction(log.LogActionId),
            SingleTickets = log.TransIds.Where(id => ticketInfo.SingleTickets.Any(y => y.TransId == id)),
            ParlayTickets = log.TransIds.Where(id => ticketInfo.ParlayTickets.Any(y => y.TransId == id)),
            MatchId = log.MatchId,
            Event = $"{remotingRefService.GetTeamName(log.HomeId, LanguageCode.English)} - vs - {remotingRefService.GetTeamName(log.AwayId, LanguageCode.English)}",
            DoneBy = log.DoneBy,
            HTScore = log.HTScore,
            FTScore = log.FTScore,
            KickOffTime = log.KickOffTime
        });
    }

    private static string UpdateAction(int logActionId)
    {
        var actionText = logActionId switch
        {
            UserLogConstant.ManualMark => UserLogConstant.ManualMarkText,
            UserLogConstant.ManualUnmark => UserLogConstant.ManualUnmarkText,
            UserLogConstant.AutoMark => UserLogConstant.AutoMarkText,
            UserLogConstant.AutoUnmark => UserLogConstant.AutoUnmarkText,
            UserLogConstant.UnmarkAll => UserLogConstant.UnmarkAllText,
            _ => "",
        };

        return actionText;
    }
}