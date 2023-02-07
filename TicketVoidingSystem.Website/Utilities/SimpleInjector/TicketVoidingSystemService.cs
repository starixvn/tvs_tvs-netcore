using Fanex.LetstalkService.Client;
using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class TicketVoidingSystemService
{
    public static void RegisterTicketVoidingSystemServices(this IServiceCollection services)
    {
        services.AddSingleton<SessionService, SessionServiceImp>();
        services.AddSingleton<PagingService, PagingServiceImp>();
        services.AddSingleton<LoggingService, LoggingServiceImp>();
        services.AddScoped(typeof(ExcelService<>), typeof(ExcelServiceImp<>));
        services.AddSingleton<RemotingRefWrapperService, RemotingRefWrapperServiceImp>();
        services.AddSingleton<BetListService, BetListServiceImp>();
        services.AddSingleton<OddsService, OddsServiceImp>();
        services.AddSingleton<MatchService, MatchServiceImp>();
        services.AddSingleton<LogActionFilterAttribute>();
        services.AddSingleton<LetstalkClientService, LetstalkClientServiceImp>();
        services.AddSingleton<NotificationLetstalkService, NotificationLetstalkServiceImp>();
    }
}