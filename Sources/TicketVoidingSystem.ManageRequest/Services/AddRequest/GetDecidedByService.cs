using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface GetDecidedByService
{
    Task<string[]> GetDecidedBy(GetDecidedByRequest request);
}

public class GetDecidedByServiceImp(IDynamicRepository repository) : GetDecidedByService
{
    public async Task<string[]> GetDecidedBy(GetDecidedByRequest request)
    {
        var decidedBySelect = await repository.FetchAsync<string>(request);
        var sortedDecidedBys = decidedBySelect.OrderByDescending(name => name.StartsWith("SSNV")).ToArray();

        return sortedDecidedBys;
    }
}