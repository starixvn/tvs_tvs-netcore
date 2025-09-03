using System;
using System.Threading.Tasks;
using Fanex.BetList.Core;
using Fanex.BetList.Core.RemotingRef;
using Fanex.Data.Repository;
using Fanex.LetstalkService.Client;
using Fanex.Logging.Extensions;
using Fanex.Logging.Extensions.AspNetCore;
using Fanex.MailDeliver.MailClient;
using Fanex.RemotingRef;
using Fanex.SiteDbConnectionManager.Client;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.CashOutTransaction;
using SpecialDelete.CashOutTransaction.CancelCashOut;
using SpecialDelete.NumberGame;
using SpecialDelete.NumberGame.Controllers;
using SpecialDelete.RecoverBet;
using SpecialDelete.RecoverBet.Controllers;
using SpecialDelete.RecoverByBetId;
using SpecialDelete.RecoverByBetId.Controllers;
using SpecialDelete.RecoverParlayBet;
using SpecialDelete.RecoverParlayBet.Controllers;
using SpecialDelete.UploadBatchMessage.Controllers;
using SpecialDelete.VirtualSports;
using SpecialDelete.VirtualSports.RecoverBet.Controllers;
using SpecialDelete.VirtualSports.VoidParlaySub.Controllers;
using SpecialDelete.VoidByBetId;
using SpecialDelete.VoidByBetId.Controllers;
using SpecialDelete.VoidByCurrency;
using SpecialDelete.VoidByCurrency.Controllers;
using StackExchange.Redis;
using TicketVoidingSystem.ABExceptionList.Controllers;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest;
using TicketVoidingSystem.ManageRequest.Controllers;
using TicketVoidingSystem.ManageVoidServices.Controllers;
using TicketVoidingSystem.MarkTickets;
using TicketVoidingSystem.MarkTickets.Controllers;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;
using TicketVoidingSystem.SharedApi;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SignalR;
using TicketVoidingSystem.TicketListing;
using TicketVoidingSystem.TicketListing.Controllers;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.VoidSingleBet;
using TicketVoidingSystem.VoidSingleBet.Controllers;
using TicketVoidingSystem.Web;
using TicketVoidingSystem.Website.Utilities.CustomServices;
using TicketVoidingSystem.Website.Utilities.SimpleInjector;
using TicketVoidingSystem.Website.Utilities.SimpleInjector.AddRequest;
using TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;
using TicketVoidingSystem.Website.Utilities.SimpleInjector.TicketVoidingSystem;
using TicketVoidingSystem.Website.Utilities.SimpleInjector.VoidRequest;

namespace TicketVoidingSystem.Website.Utilities;

public static class ServiceCollectionExtension
{
    public static void AddTvsAppSetting(this IServiceCollection services, IConfiguration configuration)
    {
        AppSettingService.InitSetting(configuration);
    }

    public static void AddExceptionHandler(this IServiceCollection services)
    {
        var configuration = new LoggingConfiguration()
            .GetHttpHeaderInfo()
            .GetHttpSessionInfo();
        ExceptionHandler.UseConfig(configuration);
    }

    public static void AddTvsAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromMinutes(AppSettingService.AppSetting.AuthSettings.CookieTimeOut);
                options.Cookie = new CookieBuilder
                {
                    Name = "TicketVoidingSystem.Cookie",
                    SecurePolicy = CookieSecurePolicy.SameAsRequest
                };
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.Redirect(AppSettingService.AppSetting.AuthSettings.LoginPath);
                    return Task.CompletedTask;
                };
                options.Events.OnSigningOut = context =>
                {
                    context.Response.Redirect(options.LoginPath);
                    return Task.CompletedTask;
                };
            });

        // Persist data protection keys to distributed cache
        services.AddDataProtection()
            .PersistKeysToStackExchangeRedis(LazyRedisMultiplexer.GetDatabase, "TicketVoidingSystem.DataProtection.Keys");
        services.AddDistributedMemoryCache();
        services.AddStackExchangeRedisCache(options =>
        {
            options.ConfigurationOptions = LazyRedisMultiplexer.GetRedisConfig();
            options.InstanceName = "TicketVoidingSystem.Redis.Session";
        });

        services.AddSession(options =>
        {
            options.Cookie.IsEssential = true;
            options.IdleTimeout = TimeSpan.FromMinutes(AppSettingService.AppSetting.AuthSettings.SessionTimeOut);
            options.Cookie.Name = "TicketVoidingSystem.Session";
        });
    }

    public static void AddTvsSiteDbStatus(this IServiceCollection services)
    {
        services.AddSiteDbConnectionManager();
        services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(LazyRedisMultiplexer.GetRedisConfig()));
    }

    public static void AddTvsSignalR(this IServiceCollection services)
    {
        services.AddSignalR().AddStackExchangeRedis(options =>
        {
            options.Configuration.EndPoints.Add(AppSettingService.AppSetting.RedisConfig.EndPoint);
            options.Configuration.Password = AppSettingService.AppSetting.RedisConfig.Password;
            options.Configuration.DefaultDatabase = AppSettingService.AppSetting.RedisConfig.DefaultDatabase;
            options.Configuration.ChannelPrefix = RedisChannel.Literal(AppSettingService.AppSetting.RedisConfig.SignalRChannelPrefix);
        });
    }

    public static void AddOnlineServerRepository(this IServiceCollection services)
    {
        services.AddSingleton<OnlineServerRepositoryBaseServiceImp>();
        services.AddScoped<OnlineServerRepository, OnlineServerRepositoryImp>();
    }

    public static void AddRemotingRef(this IServiceCollection services)
    {
        RefDataTypeContainer
            .ConnectTo(new Uri(AppSettingService.AppSetting.FanexRemotingRefServiceUrl))
            .FromApplication(AppSettingService.AppSetting.ServiceName)
            .RegisterSupportedLanguages(LanguageCode.English, LanguageCode.ChineseTraditional, LanguageCode.ChineseSimplified, LanguageCode.NewChineseSimplified);

        BetListManager.RegisterRemotingRef(new CacheRef());
    }

    public static void AddLetstalk(this IServiceCollection services)
    {
        AppConfigService.Config.LetstalkServiceApi = AppSettingService.AppSetting.LetstalkConfig.LetstalkServiceApi;
    }

    public static void AddCoreServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IDynamicRepository, DynamicRepository>();
        services.AddSingleton<IUserIdProvider, CustomIdProvider>();
        services.AddSingleton<IRemotingRefService, RemotingRefService>();
    }

    public static void AddFanexMailService(this IServiceCollection services)
    {
        AppSettings.AppMailId = AppSettingService.AppSetting.FanexMailService.AppMailId;
        AppSettings.AppMailAddress = AppSettingService.AppSetting.FanexMailService.AppMailAddress;
    }

    public static void AddIssueTypeAuth(this IServiceCollection services)
    {
        services.AddAuthorization();
        services.AddScoped<IAuthorizationHandler, IssueTypeAuthorizationHandler>();
    }

    public static void AddBusinessServices(this IServiceCollection services)
    {
        services.AddTicketVoidingSystemServices();
        services.AddSharedApiServices();
        services.AddAbExceptionListServices();
        services.AddManageVoidServices();
        services.AddMarkTicketsServices();
        services.AddTicketListingServices();
        services.AddVoidSingleBetServices();
        services.AddAddRequestServices();
        services.AddManageRequestServices();
        services.AddVoidRequestServices();
        services.AddUploadBatchMessageServices();
        services.AddVirtualSportsVoidServices();
        services.AddVirtualSportsRecoverServices();
        services.AddRecoverByBetIdServices();
        services.AddVoidNumberGameServices();
        services.AddVoidByCurrencyServices();
        services.AddVoidByBetIdServices();
        services.AddCancelCashOutServices();
        services.AddRecoverCashOutServices();
        services.AddRecoverBetServices();
        services.AddRecoverParlayBetServices();
    }

    public static void AddMediatR(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(SharedApiController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(PermissionController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(BetTypesController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MatchInfoController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ABExceptionListController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ManageVoidServicesController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MarkTicketsController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(TicketListingController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidSingleBetController).Assembly));

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AddRequestController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AddRequestFromOtherSitesController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ManageRequestController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidRequestController).Assembly));

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(UploadBatchMessageController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidParlaySubBetController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RecoverVirtualSportsBetController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RecoverByBetIdController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidNumberGameBetController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidByCurrencyController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidByBetIdController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CancelCashOutController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RecoverBetController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RecoverMainParlayController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RecoverSubParlayController).Assembly));
    }

    public static void AddAutoMapper(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(TicketVoidingSystemProfile));
        services.AddAutoMapper(typeof(SharedApiProfile));
        services.AddAutoMapper(typeof(MarkTicketsProfile));
        services.AddAutoMapper(typeof(TicketListingProfile));
        services.AddAutoMapper(typeof(VoidSingleBetProfile));
        services.AddAutoMapper(typeof(ManageRequestProfile));
        services.AddAutoMapper(typeof(VirtualSportsProfile));
        services.AddAutoMapper(typeof(RecoverByBetIdProfile));
        services.AddAutoMapper(typeof(NumberGameProfile));
        services.AddAutoMapper(typeof(VoidByCurrencyProfile));
        services.AddAutoMapper(typeof(VoidByBetIdProfile));
        services.AddAutoMapper(typeof(CashOutTransactionProfile));
        services.AddAutoMapper(typeof(RecoverBetProfile));
        services.AddAutoMapper(typeof(RecoverParlayBetProfile));
    }

    public static void UseHttpContextAccessor(this WebApplication app)
    {
        HttpContextHelper.Configure(app.Services.GetRequiredService<IHttpContextAccessor>());
    }
}