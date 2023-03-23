using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Extensions;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets
{
    public interface MarkAllTicketsService
    {
        Task<Result> Execute(MarkAllTicketsQuery query);
    }

    public class MarkAllTicketsServiceImp : MarkAllTicketsService
    {
        private readonly IDynamicRepository repository;
        private readonly SessionService session;

        public MarkAllTicketsServiceImp(IDynamicRepository repository, SessionService session)
        {
            this.repository = repository;
            this.session = session;
        }

        public async Task<Result> Execute(MarkAllTicketsQuery query)
        {
            var resultInAllServers = new List<Result>();
            var criteria = new MarkAllTicketsCommand
            {
                Matches = query.Matches.ToMarkedMatchXml(),
                UserId = session.UserId,
                Ip = session.GetClientIp()
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                criteria.SiteDbGroupId = server.Id;
                var results = await repository.FetchAsync<Result>(criteria);

                resultInAllServers.AddRange(results);
            }

            return CombineResult(resultInAllServers);
        }

        private static Result CombineResult(in IEnumerable<Result> resultInAllServers)
        {
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
    }
}