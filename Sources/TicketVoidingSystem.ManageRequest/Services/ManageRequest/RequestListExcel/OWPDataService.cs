using System.Text.Json;
using Fanex.Data.Repository;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface OWPDataService
{
    public Task<IEnumerable<OWPData>> GetIPTV(IEnumerable<MatchEventDate> requests);
    public Task<IEnumerable<OWPData>> GetIPTVForRequests(IEnumerable<RequestModel> requests);
}

public class OWPDataServiceImp(IDynamicRepository repository, LoggingService loggingService)
    : OWPDataService
{
    public async Task<IEnumerable<OWPData>> GetIPTVForRequests(IEnumerable<RequestModel> requests)
    {
        var matchEventDates = requests.Where(x => x.MatchId > 0 && !x.MatchId.Value.IsParlay())
                .Select(x => new MatchEventDate
                {
                    MatchId = x.ParentMatchId is not null && x.ParentMatchId > 0 ? x.ParentMatchId.Value : x.MatchId ?? 0,
                    EventDate = x.EventDateMatch
                }).DistinctBy(x => x.MatchId);

        return await GetIPTV(matchEventDates);
    }

    public async Task<IEnumerable<OWPData>> GetIPTV(IEnumerable<MatchEventDate> requests)
    {
        try
        {
            var criteria = new GetIPTVFromOWPCriteria
            {
                MatchInfoJson = JsonSerializer.Serialize(requests)
            };

            return await repository.FetchAsync<OWPData>(criteria);
        }
        catch (Exception ex)
        {
            await loggingService.ErrorAsync(nameof(OWPDataService.GetIPTV), ex);
            return [];
        }
    }
}