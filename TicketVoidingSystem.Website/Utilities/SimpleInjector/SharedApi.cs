using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.Services.Permission;
using TicketVoidingSystem.SharedApi.Services.SharedApi;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class SharedApi
{
    public static void RegisterSharedApiServices(this IServiceCollection services)
    {
        services.AddTransient<BetTypesService, BetTypesServiceImp>();
        services.AddTransient<BetTypesRepository, BetTypesRepositoryImp>();
        services.AddTransient<BetTeamsService, BetTeamsServiceImp>();
        services.AddTransient<BalanceUpService, BalanceUpServiceImp>();
        services.AddTransient<TicketsService, TicketsServiceImp>();
        services.AddTransient<CheckTicketsStatusService, CheckTicketsStatusServiceImp>();
    }
}