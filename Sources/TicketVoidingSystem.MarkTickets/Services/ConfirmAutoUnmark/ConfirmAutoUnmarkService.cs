using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;

namespace TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;

public interface ConfirmAutoUnmarkService
{
    Task<IEnumerable<ConfirmAutoUnmarkModel>> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkQuery query);
}

public class ConfirmAutoUnmarkServiceImp : ConfirmAutoUnmarkService
{
    private readonly IDynamicRepository repository;

    public ConfirmAutoUnmarkServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<ConfirmAutoUnmarkModel>> GetDataForConfirmAutoUnmark(GetDataForConfirmAutoUnmarkQuery query)
    {
        var transInfoJsonList = await GetTransInfoForAutoUnmark(query);
        var criteria = new GetDataForConfirmAutoUnmarkCriteria
        {
            TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)))
        };

        return await repository.FetchAsync<ConfirmAutoUnmarkModel>(criteria);
    }

    private async Task<IEnumerable<string>> GetTransInfoForAutoUnmark(GetDataForConfirmAutoUnmarkQuery query)
    {
        var criteria = new GetTransInfoForAutoUnmarkCriteria
        {
            MatchId = query.MatchId != null ? int.Parse(query.MatchId) : null,
            SportType = query.SportType,
            MarkedBy = query.MarkedBy,
            IsExcludeTest = query.IsExcludeTest
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.GetAsync<string>(criteria);
        });

        var dataInAllServers = await Task.WhenAll(tasks);
        return dataInAllServers;
    }
}