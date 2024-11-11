using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.SharedApi.Services.Analytics;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.Services.MessageTemplate;
using TicketVoidingSystem.SharedApi.Services.Permission;
using TicketVoidingSystem.SharedApi.Services.SharedApi;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class SharedApi
{
    public static void AddSharedApiServices(this IServiceCollection services)
    {
        services.AddTransient<BetTypesRepository, BetTypesRepositoryImp>();
        services.AddTransient<BetTeamsService, BetTeamsServiceImp>();
        services.AddTransient<BalanceUpService, BalanceUpServiceImp>();
        services.AddTransient<TicketsService, TicketsServiceImp>();
        services.AddTransient<CheckTicketsStatusService, CheckTicketsStatusServiceImp>();
        services.AddTransient<SpecialBetTypeContentService, SpecialBetTypeContentServiceImp>();
        services.AddTransient<UserActionLogService, UserActionLogServiceImp>();
        services.AddTransient<FilterCurrencyLicenseeService, FilterCurrencyLicenseeServiceImp>();
    }
}