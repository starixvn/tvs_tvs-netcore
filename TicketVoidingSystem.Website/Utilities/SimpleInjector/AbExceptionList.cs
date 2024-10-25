using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ABExceptionList.Services;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class AbExceptionList
{
    public static void AddAbExceptionListServices(this IServiceCollection services)
    {
        services.AddTransient<GetUsersService, GetUsersServiceImp>();
    }
}