using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Extensions;
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
        var criteria = new GetDataForConfirmAutoUnmarkCriteria();

        criteria.TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)));

        return await repository.FetchAsync<ConfirmAutoUnmarkModel>(criteria);
    }

    private async Task<IEnumerable<string>> GetTransInfoForAutoUnmark(GetDataForConfirmAutoUnmarkQuery query)
    {
        var dataInAllServers = new List<string>();
        var criteria = new GetTransInfoForAutoUnmarkCriteria
        {
            MatchId = query.MatchId != null ? int.Parse(query.MatchId) : null,
            SportType = query.SportType,
            MarkedBy = query.MarkedBy,
            IsExcludeTest = query.IsExcludeTest
        };

        foreach (var server in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = server.Id;
            var data = await repository.GetAsync<string>(criteria);
            dataInAllServers.Add(data);
        }
        return dataInAllServers;
    }
}