using Fanex.LetstalkService.Client;
using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.Letstalk.GroupAbnormalBetRequest;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
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
        services.AddTransient<MatchService, MatchServiceImp>();
        services.AddSingleton<LogActionFilterAttribute>();

        //Letstalk
        services.AddSingleton<LetstalkClientService, LetstalkClientServiceImp>();
        services.AddSingleton<LetstalkSingleMessageService, LetstalkSingleMessageServiceImp>();
        services.AddSingleton<NotificationLetstalkService, NotificationLetstalkServiceImp>();
        services.AddSingleton<UusTicketService, UusTicketServiceImp>();
        services.AddSingleton<MessageContentService, MessageContentServiceImp>();
        services.AddSingleton<GroupVoidSettledBetService, GroupVoidSettledBetServiceImp>();
        services.AddSingleton<GroupTicketListingService, GroupTicketListingServiceImp>();
        services.AddSingleton<GroupAbnormalBetRequestService, GroupAbnormalBetRequestServiceImp>();
    }
}