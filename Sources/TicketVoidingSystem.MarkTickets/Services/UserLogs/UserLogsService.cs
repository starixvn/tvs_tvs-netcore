using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Criteria;
using TicketVoidingSystem.MarkTickets.Criteria.UserLogs;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Services.UserLogs
{
    public interface UserLogsService
    {
        Task<IEnumerable<GetUserLogModel>> GetUserLogs(GetUserLogsQuery query);

        Task<IEnumerable<GetUserLogViewModel>> CreateUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs);
    }

    public class UserLogServiceImp : UserLogsService
    {
        private readonly Repository repository;
        private readonly RemotingRefWrapperService remotingRefService;

        public UserLogServiceImp(Repository repository, RemotingRefWrapperService remotingRefService)
        {
            this.repository = repository;
            this.remotingRefService = remotingRefService;
        }

        public async Task<IEnumerable<GetUserLogModel>> GetUserLogs(GetUserLogsQuery query)
        {
            var criteria = Mapper.Map<GetUserLogsCriteria>(query);
            criteria.LogDateFrom = query.LogDateFrom.ZoneCanada();
            criteria.LogDateTo = query.LogDateTo.AddDays(1).ZoneCanada();
            var logs = await repository.GetLogs(criteria);

            return logs.ToList();
        }

        public async Task<IEnumerable<GetUserLogViewModel>> CreateUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs)
        {
            var listTransIds = new List<string>();
            foreach (var log in originalLogs)
            {
                if (!string.IsNullOrWhiteSpace(log.LogData))
                {
                    log.TransIds = log.LogData.Split(',');
                    listTransIds.AddRange(log.TransIds);
                }
                else
                {
                    log.TransIds = new List<string>();
                }
            }

            var ticketInfoCriteria = new GetUserLogTicketInfoCriteria { TransIdsXml = listTransIds.Distinct().ToXml() };
            var ticketInfo = await repository.GetUserLogTicketInfo(ticketInfoCriteria);

            var finalLogs = new List<GetUserLogViewModel>();
            var index = 1;
            foreach (var log in originalLogs)
            {
                var finalLog = new GetUserLogViewModel
                {
                    No = index++,
                    ActionId = log.SessionId,
                    LogDate = log.CreatedDate,
                    Action = UpdateAction(log.LogActionId),
                    SingleTickets = log.TransIds.Where(id => ticketInfo.SingleTickets.Any(y => y.TransId == id)),
                    ParlayTickets = log.TransIds.Where(id => ticketInfo.ParlayTickets.Any(y => y.TransId == id)),
                    MatchId = log.MatchId,
                    Event = remotingRefService.GetTeamName(log.HomeId, LanguageCode.English) + " - vs - " + remotingRefService.GetTeamName(log.AwayId, LanguageCode.English),
                    DoneBy = log.DoneBy,
                    HTScore = log.HTScore,
                    FTScore = log.FTScore,
                    KickOffTime = log.KickOffTime
                };

                finalLogs.Add(finalLog);
            }

            return finalLogs;
        }

        private static string UpdateAction(int logActionId)
        {
            string actionText;
            switch (logActionId)
            {
                case UserLogConstant.ManualMark:
                    actionText = UserLogConstant.ManualMarkText;
                    break;

                case UserLogConstant.ManualUnmark:
                    actionText = UserLogConstant.ManualUnmarkText;
                    break;

                case UserLogConstant.AutoMark:
                    actionText = UserLogConstant.AutoMarkText;
                    break;

                case UserLogConstant.AutoUnmark:
                    actionText = UserLogConstant.AutoUnmarkText;
                    break;

                case UserLogConstant.UnmarkAll:
                    actionText = UserLogConstant.UnmarkAllText;
                    break;

                default:
                    actionText = "";
                    break;
            }

            return actionText;
        }
    }
}