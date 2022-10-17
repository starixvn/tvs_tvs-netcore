using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using SpecialDelete.Common.Services;
using SpecialDelete.Core.Constants;
using SpecialDelete.Core.DTO;
using TicketVoidingSystem.MarkTickets.Criteria;
using SpecialDelete.MarkTickets.Extensions;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    public class MarkAllTicketsRequest : MarkAllTicketsQuery, IRequest<Result>
    {
    }

    public class MarkAllTicketsHandler : IAsyncRequestHandler<MarkAllTicketsRequest, Result>
    {
        private readonly IDynamicRepository repository;
        private readonly ISessionService session;

        public MarkAllTicketsHandler(IDynamicRepository repository, ISessionService session)
        {
            this.repository = repository;
            this.session = session;
        }

        public async Task<Result> Handle(MarkAllTicketsRequest message)
        {
            var resultInAllServers = await ExecuteMarkAllTicketInAllServer(message);
            var firstErrorResult = resultInAllServers.FirstOrDefault(x => !x.IsSuccessful);
            if (firstErrorResult == null)
            {
                return new Result { ErrorCode = 0, ErrorMsg = "Unmark tickets successfully!" };
            }

            return new Result
            {
                ErrorCode = firstErrorResult.ErrorCode,
                ErrorMsg = firstErrorResult.ErrorMsg
            };
        }

        private async Task<IEnumerable<Result>> ExecuteMarkAllTicketInAllServer(MarkAllTicketsRequest message)
        {
            var resultInAllServers = new List<Result>();
            var criteria = new MarkAllTicketsCommand
            {
                Matches = message.Matches.ToXml(),
                UserId = session.UserId,
                Ip = session.GetClientIp()
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var results = await repository.FetchAsync<Result>(criteria);

                resultInAllServers.AddRange(results);
            }

            return resultInAllServers;
        }
    }
}