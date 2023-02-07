using Microsoft.Extensions.DependencyInjection;
using Olympus.SimpleDataApi;
using TicketVoidingSystem.SharedApi.Services;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SimpleDataApi;
using TicketVoidingSystem.SimpleDataApi.Services;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class SharedApi
{
    public static void RegisterSharedApiServices(this IServiceCollection services)
    {
        services.AddTransient<SimpleCriteriaFactory, SimpleCriteriaFactoryImp>();
        services.AddTransient<SimpleFunctionPermissionFactory, SimpleFunctionPermissionFactoryImp>();
        services.AddTransient<SimpleMapperFactory, SimpleMapperFactoryImp>();
        services.AddTransient<TicketsCheckPermissionService, TicketsCheckPermissionServiceImp>();
        services.AddTransient<BetTypesService, BetTypesServiceImp>();
        services.AddTransient<BetTypesRepository, BetTypesRepositoryImp>();
        services.AddTransient<BetTeamsService, BetTeamsServiceImp>();
        services.AddTransient<BalanceUpService, BalanceUpServiceImp>();
        services.AddTransient<TicketsService, TicketsServiceImp>();
    }
}