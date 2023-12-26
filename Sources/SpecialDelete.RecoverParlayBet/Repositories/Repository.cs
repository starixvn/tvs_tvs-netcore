using Fanex.Data.Repository;
using SpecialDelete.RecoverParlayBet.Models;

namespace SpecialDelete.RecoverParlayBet.Repositories;

public interface Repository
{
    Task<(IEnumerable<T> Tickets, IEnumerable<InvalidTransIds> InvalidTransIds)> GetTickets<T>(ICriteria criteria);

    Task<(IEnumerable<RecoverValidationModel> Validation, IEnumerable<T> Tickets)> RecoverTickets<T>(ICriteria criteria);
}

public class RepositoryImp : Repository
{
    private readonly IDynamicRepository repository;

    public RepositoryImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<(IEnumerable<T> Tickets, IEnumerable<InvalidTransIds> InvalidTransIds)> GetTickets<T>(ICriteria criteria)
    {
        var (tickets, invalidTransIds) = await repository.FetchMultipleAsync<T, InvalidTransIds>(criteria);
        return (tickets, invalidTransIds);
    }

    public async Task<(IEnumerable<RecoverValidationModel> Validation, IEnumerable<T> Tickets)> RecoverTickets<T>(ICriteria criteria)
    {
        var (validation, tickets) = await repository.FetchMultipleAsync<RecoverValidationModel, T>(criteria);
        return (validation, tickets);
    }
}