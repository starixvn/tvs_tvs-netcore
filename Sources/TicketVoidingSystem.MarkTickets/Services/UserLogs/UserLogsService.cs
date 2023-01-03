using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Criteria.UserLogs;
using TicketVoidingSystem.MarkTickets.Extensions;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;

namespace TicketVoidingSystem.MarkTickets.Services.UserLogs
{
    public interface UserLogsService
    {
        Task<IEnumerable<GetUserLogModel>> GetUserLogs(GetUserLogsQuery query);

        Task<IEnumerable<GetUserLogViewModel>> CreateUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs);
    }

    public class UserLogServiceImp : UserLogsService
    {
        private readonly IMapper mapper;
        private readonly IDynamicRepository repository;
        private readonly MapUserLogsService mapUserLogsService;

        public UserLogServiceImp(IMapper mapper, IDynamicRepository repository, MapUserLogsService mapUserLogsService)
        {
            this.mapper = mapper;
            this.repository = repository;
            this.mapUserLogsService = mapUserLogsService;
        }

        public async Task<IEnumerable<GetUserLogModel>> GetUserLogs(GetUserLogsQuery query)
        {
            var criteria = mapper.Map<GetUserLogsCriteria>(query);
            criteria.LogDateFrom = query.LogDateFrom.ZoneCanada();
            criteria.LogDateTo = query.LogDateTo.AddDays(1).ZoneCanada();

            return await repository.FetchAsync<GetUserLogModel>(criteria);
        }

        public async Task<IEnumerable<GetUserLogViewModel>> CreateUserLogViewModels(IEnumerable<GetUserLogModel> originalLogs)
        {
            UpdateTransIdsProp(originalLogs);
            var transIdsInAllLogs = originalLogs.SelectMany(x => x.TransIds).Distinct();
            var ticketsInfo = await GetTicketsInfo(transIdsInAllLogs);
            var viewModel = mapUserLogsService.MapToUserLogViewModels(originalLogs, ticketsInfo);

            return viewModel;
        }

        private static void UpdateTransIdsProp(IEnumerable<GetUserLogModel> originalLogs)
        {
            foreach (var log in originalLogs)
            {
                log.TransIds = !string.IsNullOrWhiteSpace(log.LogData) ? log.LogData.Split(',') : new List<string>();
            }
        }

        private async Task<UserLogTicketInfo> GetTicketsInfo(IEnumerable<string> transIdsInAllLogs)
        {
            var criteria = new GetUserLogTicketInfoCriteria { TransIdsXml = transIdsInAllLogs.ToTransIdsXml() };
            var (singleTickets, parlayTickets) = await repository.FetchMultipleAsync<TicketInfo, TicketInfo>(criteria);

            return new UserLogTicketInfo
            {
                SingleTickets = singleTickets,
                ParlayTickets = parlayTickets
            };
        }
    }
}