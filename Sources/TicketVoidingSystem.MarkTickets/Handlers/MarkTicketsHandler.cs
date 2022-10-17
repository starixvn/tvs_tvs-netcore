using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using SpecialDelete.Common.Services;
using SpecialDelete.Core.Constants;
using SpecialDelete.Core.DTO;
using SpecialDelete.Core.Utils;
using TicketVoidingSystem.MarkTickets.Criteria;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    public class MarkTicketsRequest : MarkTicketsQuery, IRequest<Result>
    {
    }

    public class MarkTicketsHandler : IAsyncRequestHandler<MarkTicketsRequest, Result>
    {
        private readonly IDynamicRepository repository;
        private readonly ISessionService session;

        public MarkTicketsHandler(IDynamicRepository repository, ISessionService session)
        {
            this.repository = repository;
            this.session = session;
        }

        public async Task<Result> Handle(MarkTicketsRequest message)
        {
            var resultInAllServers = await ExecuteMarkTicketInAllServer(message);
            var firstErrorResult = resultInAllServers.FirstOrDefault(x => !x.IsSuccessful);
            var combineResult = new Result
            {
                ErrorCode = firstErrorResult?.ErrorCode ?? 0,
                ErrorMsg = firstErrorResult?.ErrorMsg ?? string.Empty
            };

            return combineResult;
        }

        private async Task<IEnumerable<Result>> ExecuteMarkTicketInAllServer(MarkTicketsRequest message)
        {
            var resultInAllServers = new List<Result>();
            var criteria = new MarkTicketsCommand
            {
                Status = message.Status,
                UserId = session.UserId,
                Ip = session.GetClientIp(),
                LogActionId = message.Status == 0 ? 90500 : 90501
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                var ticketsInServer = message.Tickets.Where(x => x.SiteDbGroupId == server.Id);
                if (ticketsInServer.Any())
                {
                    criteria.SiteDbGroupId = server.Id;
                    criteria.TransIds = Helper.JoinBetIdList(ticketsInServer);
                    var results = await repository.FetchAsync<Result>(criteria);
                    resultInAllServers.AddRange(results);
                }
            }

            return resultInAllServers;
        }
    }
}