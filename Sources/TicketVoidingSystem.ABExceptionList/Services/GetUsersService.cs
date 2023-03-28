using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using TicketVoidingSystem.Extensions;

namespace TicketVoidingSystem.ABExceptionList.Services;

public interface GetUsersService
{
    Task<IEnumerable<UserModel>> GetUsers(GetUsersRequest request);
}

public class GetUsersServiceImp : GetUsersService
{
    private readonly IDynamicRepository repository;

    public GetUsersServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<UserModel>> GetUsers(GetUsersRequest request)
    {
        var users = await repository.FetchAsync<UserModel>(request);
        foreach (var user in users)
        {
            user.AddedDate = user.AddedDate.ZoneManila();
        }

        return users;
    }
}