using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;

namespace TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark
{
    public interface AutoUnmarkService
    {
        Task InsertAutoUnmarkSetting(UpdateConfirmAutoUnmarkQuery query);

        Task<IEnumerable<BetId>> GetTicketsAbnormalBetByMatchId(int matchId);

        Task<UpdateConfirmAutoUnmarkValidation> UpdateConfirmAutoUnmark(UpdateConfirmAutoUnmarkQuery query);
    }

    public class AutoUnmarkServiceImp : AutoUnmarkService
    {
        private readonly IDynamicRepository repository;
        private readonly ISessionService session;

        public AutoUnmarkServiceImp(IDynamicRepository repository, ISessionService session)
        {
            this.repository = repository;
            this.session = session;
        }

        public async Task InsertAutoUnmarkSetting(UpdateConfirmAutoUnmarkQuery query)
        {
            var criteria = new InsertAutoUnmarkSettingCriteria
            {
                MatchId = query.MatchId,
                Bettype = query.Bettype,
                MarkedBy = query.MarkedBy,
                BetId = query.BetId,
                UserId = session.UserId
            };
            await repository.ExecuteAsync(criteria);
        }

        public async Task<IEnumerable<BetId>> GetTicketsAbnormalBetByMatchId(int matchId)
        {
            var criteria = new GetTicketsAbnormalBetCriteria
            {
                MatchId = matchId
            };

            return await repository.FetchAsync<BetId>(criteria);
        }

        public async Task<UpdateConfirmAutoUnmarkValidation> UpdateConfirmAutoUnmark(UpdateConfirmAutoUnmarkQuery query)
        {
            await InsertAutoUnmarkSetting(query);
            var tickets = await GetTicketsAbnormalBetByMatchId(query.MatchId);

            var validationInAllServers = new List<UpdateConfirmAutoUnmarkValidation>();
            var criteria = new UpdateConfirmAutoUnmarkCriteria
            {
                MatchId = query.MatchId,
                Bettype = query.Bettype,
                MarkedBy = query.MarkedBy,
                BetId = query.BetId,
                UserId = session.UserId
            };

            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                var ticketsInCurrentServer = tickets.Where(x => x.SiteDbGroupId == server.Id);
                criteria.SiteDbGroupId = server.Id;
                criteria.TransIds = Helper.JoinBetIdList(ticketsInCurrentServer);
                var validation = await repository.FetchAsync<UpdateConfirmAutoUnmarkValidation>(criteria);

                validationInAllServers.AddRange(validation);
            }

            return CombineValidation(validationInAllServers);
        }

        private static UpdateConfirmAutoUnmarkValidation CombineValidation(IEnumerable<UpdateConfirmAutoUnmarkValidation> validationInAllServers)
        {
            const int CodeConfirmOkButNoTickets = 111;
            var errorResult = validationInAllServers.FirstOrDefault(x => x.ErrorCode != 0 && x.ErrorCode != CodeConfirmOkButNoTickets);
            if (errorResult == null)
            {
                errorResult = validationInAllServers.All(x => x.ErrorCode == CodeConfirmOkButNoTickets)
                    ? validationInAllServers.First()
                    : new UpdateConfirmAutoUnmarkValidation { ErrorCode = 0, ErrorMsg = string.Empty };
            }

            return new UpdateConfirmAutoUnmarkValidation
            {
                ErrorCode = errorResult.ErrorCode,
                ErrorMsg = errorResult.ErrorMsg,
                NegativeBalanceUsers = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.NegativeBalanceUsers))
            };
        }
    }
}