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

public class UpdateConfirmAutoUnmarkServiceImp : UpdateConfirmAutoUnmarkService
{
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly CombineValidationService combineValidationService;

    public UpdateConfirmAutoUnmarkServiceImp(IDynamicRepository repository, SessionService sessionService, CombineValidationService combineValidationService)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.combineValidationService = combineValidationService;
    }

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
        var validationInAllServers = new List<UpdateConfirmAutoUnmarkValidation>();
        var criteria = new UpdateConfirmAutoUnmarkCriteria
        {
            MatchId = query.ChildMatchId ?? query.MatchId,
            Bettype = query.Bettype,
            MarkedBy = query.MarkedBy,
            BetId = query.BetId,
            UserId = sessionService.UserId
        };

        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            var ticketsInCurrentServer = abnormalBetTickets.Where(x => x.SiteDbGroupId == server.Id);
            criteria.SiteDbGroupId = server.Id;
            criteria.TransIds = Helper.JoinBetIdList(ticketsInCurrentServer);
            var validation = await repository.FetchAsync<UpdateConfirmAutoUnmarkValidation>(criteria);

            validationInAllServers.AddRange(validation);
        }

        return combineValidationService.CombineUpdateResult(validationInAllServers);
    }
}