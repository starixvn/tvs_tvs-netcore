using Fanex.LetstalkService.Client;
using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.Letstalk.GroupAbnormalBetRequest;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using TicketVoidingSystem.Services.NetPosition;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.SignalR;
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
        services.AddSingleton<VoidResultCacheService, VoidResultCacheServiceImp>();

        //Letstalk
        services.AddSingleton<LetstalkClientService, LetstalkClientServiceImp>();
        services.AddSingleton<LetstalkSingleMessageService, LetstalkSingleMessageServiceImp>();
        services.AddSingleton<NotificationLetstalkService, NotificationLetstalkServiceImp>();
        services.AddSingleton<UusTicketService, UusTicketServiceImp>();
        services.AddSingleton<MessageContentService, MessageContentServiceImp>();
        services.AddSingleton<GroupVoidSettledBetService, GroupVoidSettledBetServiceImp>();
        services.AddSingleton<GroupTicketListingService, GroupTicketListingServiceImp>();
        services.AddSingleton<GroupAbnormalBetRequestService, GroupAbnormalBetRequestServiceImp>();

        //JackTime CashOut
        services.AddSingleton<CashOutApiService, CashOutApiServiceImp>();

        //NetPosition
        services.AddScoped<NetPositionService, NetPositionServiceImp>();

        //Send Email
        services.AddSingleton<SubjectLabelsService, SubjectVoidImp>();
        services.AddSingleton<SubjectService, SubjectServiceImp>();
        services.AddSingleton<BetListCoreService, BetListCoreServiceImp>();
        services.AddSingleton<TicketService, TicketServiceImp>();
        services.AddScoped<VoidEmailContentService, VoidEmailContentServiceImp>();
        services.AddScoped<EmailCashOutService, EmailCashOutServiceImp>();
        services.AddScoped<EmailItQaService, EmailItQaServiceImp>();
        services.AddScoped<EmailItSupportService, EmailItSupportServiceImp>();
        services.AddScoped<EmailLicenseeService, EmailLicenseeServiceImp>();
        services.AddScoped<EmailSimpleService, EmailSimpleServiceImp>();
        services.AddScoped<FanexMailApiService, FanexMailApiServiceImp>();
        services.AddSingleton<MailResultService, MailResultServiceImp>();
        services.AddScoped<SendEmailService, SendEmailServiceImp>();
        services.AddScoped<SitesEmailService, SitesEmailServiceImp>();
        services.AddSingleton<TemplateEmailService, TemplateEmailServiceImp>();

        //Send Message
        services.AddSingleton<MessageItemService, MessageItemServiceImp>();
        services.AddScoped<SendMessageService, SendMessageServiceImp>();

        // SignalR
        services.AddSingleton<NotificationSignalRService, NotificationSignalRServiceImp>();
    }
}