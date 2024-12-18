using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;

public interface UpdateConfirmAutoUnmarkService
{
    Task InsertAutoUnmarkSetting(UpdateConfirmAutoUnmarkQuery query);

    Task<IEnumerable<BetId>> GetTicketsAbnormalBetByMatchId(int matchId);

    Task<UpdateConfirmAutoUnmarkValidation> UpdateConfirmAutoUnmark(UpdateConfirmAutoUnmarkQuery query,
        IEnumerable<BetId> abnormalBetTickets);
}

public class UpdateConfirmAutoUnmarkServiceImp(
    IDynamicRepository repository,
    SessionService sessionService,
    CombineValidationService combineValidationService)
    : UpdateConfirmAutoUnmarkService
{
    public async Task InsertAutoUnmarkSetting(UpdateConfirmAutoUnmarkQuery query)
    {
        var criteria = new InsertAutoUnmarkSettingCriteria
        {
            MatchId = query.MatchId,
            Bettype = query.Bettype,
            MarkedBy = query.MarkedBy,
            BetId = query.BetId,
            UserId = sessionService.UserId
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

    public async Task<UpdateConfirmAutoUnmarkValidation> UpdateConfirmAutoUnmark(UpdateConfirmAutoUnmarkQuery query, IEnumerable<BetId> abnormalBetTickets)
    {
        var criteria = new UpdateConfirmAutoUnmarkCriteria
        {
            MatchId = query.ChildMatchId ?? query.MatchId,
            Bettype = query.Bettype,
            MarkedBy = query.MarkedBy,
            BetId = query.BetId,
            UserId = sessionService.UserId
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var ticketsInCurrentServer = abnormalBetTickets.Where(x => x.SiteDbGroupId == server.Id);
            criteria.SiteDbGroupId = server.Id;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInCurrentServer);
            return repository.FetchAsync<UpdateConfirmAutoUnmarkValidation>(criteria);
        });

        var validationInAllServers = await Task.WhenAll(tasks);
        return combineValidationService.CombineUpdateResult(validationInAllServers.SelectMany(x => x));
    }
}