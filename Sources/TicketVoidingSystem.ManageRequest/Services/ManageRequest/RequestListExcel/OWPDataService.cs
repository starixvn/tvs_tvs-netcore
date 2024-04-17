using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface OWPDataService
{
    public Task<IEnumerable<OWPData>> GetIPTV(IEnumerable<RequestModel> requests);
}

public class OWPDataServiceImp : OWPDataService
{
    private readonly IDynamicRepository repository;

    public OWPDataServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<OWPData>> GetIPTV(IEnumerable<RequestModel> requests)
    {
        var matchEventDates = requests.Where(x => x.MatchId > 0).Select(x => new MatchEventDate
        {
            MatchId = x.MatchId ?? 0,
            EventDate = x.EventDateMatch
        }).DistinctBy(x => x.MatchId);

        var criteria = new GetIPTVFromOWPCriteria
        {
            MatchInfoJson = JsonSerializer.Serialize(matchEventDates)
        };

        return await repository.FetchAsync<OWPData>(criteria);
    }
}