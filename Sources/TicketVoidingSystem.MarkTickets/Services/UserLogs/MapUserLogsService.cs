using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Services.UserLogs;

public interface MapUserLogsService
{
    IEnumerable<GetUserLogViewModel> MapToUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs, UserLogTicketInfo ticketInfo);
}

public class MapUserLogsServiceImp(RemotingRefWrapperService remotingRefService) : MapUserLogsService
{
    public IEnumerable<GetUserLogViewModel> MapToUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs, UserLogTicketInfo ticketInfo)
    {
        var index = 1;
        return originalLogs.Select(log =>
        {
            var singleTransIds = log.TransIds.Where(id => ticketInfo.SingleTickets.Any(y => y.TransId == id));
            var parlayTransIds = log.TransIds.Where(id => ticketInfo.ParlayTickets.Any(y => y.TransId == id));
            var hybridParlayTransIds = log.TransIds.Where(id => ticketInfo.HybridParlayTickets.Any(y => y.TransId == id));
            var model = new GetUserLogViewModel
            {
                No = index++,
                ActionId = log.SessionId,
                LogDate = log.CreatedDate,
                Action = UpdateAction(log.LogActionId),
                SingleTickets = singleTransIds,
                ParlayTickets = parlayTransIds,
                HybridParlayTickets = GetHybridParlayTickets(hybridParlayTransIds, ticketInfo.HybridParlayTickets),
                Count = singleTransIds.Count() + parlayTransIds.Count() + hybridParlayTransIds.Count(),
                MatchId = log.MatchId,
                Event = $"{remotingRefService.GetTeamName(log.SportType, log.HomeId, LanguageCode.English)} - vs - {remotingRefService.GetTeamName(log.SportType, log.AwayId, LanguageCode.English)}",
                DoneBy = log.DoneBy,
                HTScore = log.HTScore,
                FTScore = log.FTScore,
                KickOffTime = log.KickOffTime,
                ChildMatchId = log.ChildMatchId
            };

            return model;
        }).ToList();
    }

    private IEnumerable<string> GetHybridParlayTickets(IEnumerable<string> hybridParlayTransIds, IEnumerable<TicketInfo> hybridParlayTickets)
    {
        return hybridParlayTickets
            .Where(x => hybridParlayTransIds.Contains(x.TransId))
            .GroupBy(x => x.MainTransId).Select(group => group.Count() > 1
                ? $"{group.Key}({string.Join(", ", group.Select(x => x.TransId))})"
                : group.Key);
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
            UserLogConstant.AutoConfirmUnmark => UserLogConstant.AutoConfirmUnmarkText,
            _ => ""
        };

        return actionText;
    }
}