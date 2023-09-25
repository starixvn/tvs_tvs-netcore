using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.BetList.Core;
using Fanex.BetList.Core.RemotingRef;
using Fanex.Caching.Redis;
using Fanex.Data.Repository;
using Fanex.LetstalkService.Core.Services;
using Fanex.Logging;
using Fanex.Logging.Extensions;
using Fanex.Logging.Extensions.AspNetCore;
using Fanex.Logging.Extensions.Database;
using Fanex.Logging.Sentry.RavenClient;
using Fanex.MailDeliver.MailClient;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Services;
using Fanex.NAP.Client.Session;
using Fanex.RemotingRef;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ONEbook.UM.AspNetCore;
using ONEbook.UM.AspNetCore.Filters;
using ONEbook.UM.Configurations;
using ONEbook.UM.Helpers;
using ONEbook.UM.Services;
using ONEbook.UM.Transport;
using SharpRaven;
using SpecialDelete.UploadBatchMessage.Controllers;
using SpecialDelete.VirtualSports;
using SpecialDelete.VirtualSports.VoidParlaySub.Controllers;
using StackExchange.Redis;
using TicketVoidingSystem.ABExceptionList.Controllers;
using TicketVoidingSystem.ManageRequest;
using TicketVoidingSystem.ManageRequest.Controllers;
using TicketVoidingSystem.ManageVoidServices.Controllers;
using TicketVoidingSystem.MarkTickets;
using TicketVoidingSystem.MarkTickets.Controllers;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SignalR;
using TicketVoidingSystem.TicketListing;
using TicketVoidingSystem.TicketListing.Controllers;
using TicketVoidingSystem.VoidSingleBet;
using TicketVoidingSystem.VoidSingleBet.Controllers;
using TicketVoidingSystem.Website.Utilities.CustomServices;
using TicketVoidingSystem.Website.Utilities.SimpleInjector;
using TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

namespace TicketVoidingSystem.Website.Utilities;

public static class ServiceCollectionExtension
{
    public static void LoadAppSetting(this IServiceCollection services, IConfiguration configuration)
    {
        AppSettingService.InitSetting(configuration);
    }

    public static void RegisterSentry(this IServiceCollection services)
    {
        LogManager
            .SetDefaultLogCategory(AppSettingService.AppSetting.CategorySentryLog)
            .Use(new List<ILogEngine>
            {
                new SentryLogging(new SentryEngineOptions
                {
                    Dsn = new Dsn(AppSettingService.AppSetting.SentryClientKey)
                })
            });
    }

    public static void RegisterFanexExceptionHandler(this IServiceCollection services)
    {
        var configuration = new LoggingConfiguration()
            .GetHttpHeaderInfo()
            .GetHttpSessionInfo()
            .UseGetDbExceptionInfo(DatabaseInfoGetters.GetDbExceptionInfo);
        ExceptionHandler.UseConfig(configuration);
    }

    public static void RegisterAuthentication(this IServiceCollection services)
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

        var redisConfig = new ConfigurationOptions();
        redisConfig.EndPoints.Add(AppSettingService.AppSetting.RedisConfig.EndPoint);
        redisConfig.Password = AppSettingService.AppSetting.RedisConfig.Password;
        redisConfig.DefaultDatabase = AppSettingService.AppSetting.RedisConfig.DefaultDatabase;
        redisConfig.ConnectRetry = 1000;
        redisConfig.ConnectTimeout = 300000;
        redisConfig.SyncTimeout = 60000;
        redisConfig.AsyncTimeout = 60000;
        var redisMultiplexer = ConnectionMultiplexer.Connect(redisConfig);

        // Persist data protection keys to distributed cache
        services.AddDataProtection()
            .PersistKeysToStackExchangeRedis(redisMultiplexer, "TicketVoidingSystem.DataProtection.Keys");
        services.AddDistributedMemoryCache();
        services.AddStackExchangeRedisCache(options =>
        {
            options.ConfigurationOptions = redisConfig;
            options.InstanceName = "TicketVoidingSystem.Redis.Session";
        });

        services.AddSession(options =>
        {
            options.Cookie.IsEssential = true;
            options.IdleTimeout = TimeSpan.FromMinutes(AppSettingService.AppSetting.AuthSettings.SessionTimeOut);
            options.Cookie.Name = "TicketVoidingSystem.Session";
        });
    }

    public static void RegisterSignalR(this IServiceCollection services)
    {
        services.AddSignalR().AddStackExchangeRedis(options =>
        {
            options.Configuration.EndPoints.Add(AppSettingService.AppSetting.RedisConfig.EndPoint);
            options.Configuration.Password = AppSettingService.AppSetting.RedisConfig.Password;
            options.Configuration.DefaultDatabase = AppSettingService.AppSetting.RedisConfig.DefaultDatabase;
            options.Configuration.ChannelPrefix = AppSettingService.AppSetting.RedisConfig.SignalRChannelPrefix;
        });
    }

    public static void RegisterRemotingRef(this IServiceCollection services)
    {
        RefDataTypeContainer
            .ConnectTo(new Uri(AppSettingService.AppSetting.FanexRemotingRefServiceUrl))
            .FromApplication(AppSettingService.AppSetting.ServiceName)
            .RegisterSupportedLanguages("en-US", "zh-TW", "zh-CN", "zh-Hans");

        BetListManager.RegisterRemotingRef(new CacheRef());
    }

    public static void RegisterLetstalk(this IServiceCollection services)
    {
        AppConfigService.Config.LetstalkServiceApi = AppSettingService.AppSetting.LetstalkConfig.LetstalkServiceApi;
    }

    public static void RegisterCoreServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddSingleton<INapSettings>(new NapSettings(configuration));
        services.AddSingleton<INapSession, NapSession>();
        services.AddSingleton<ISecurityService, SecurityService>();
        services.AddSingleton<IGroupService, GroupService>();
        services.AddSingleton<IUserService, UserService>();
        services.AddScoped<IDynamicRepository, DynamicRepository>();
        services.AddTransient<ILogger, Logger>();
        services.AddSingleton<IUserIdProvider, CustomIdProvider>();
        services.AddScoped<CheckUMFilterAttribute>();
        services.AddSingleton<IRemotingRefService, RemotingRefService>();
    }

    public static void RegisterFanexCaching(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddRedisCache(configuration.GetSection("FanexCachingRedis"));
    }

    public static void RegisterOneBookUM(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton(new UMClientConfiguration().Initialize(configuration));
        services.AddSingleton<IUMCacheService, MemoryUMCacheService>();
        services.AddSingleton<IUMRestClient, UMRestClient>();
        services.AddSingleton<IPHelper, IPHelperImpl>();
        services.AddSingleton<IHttpContextHelper, HttpContextHelper>();
        services.AddSingleton<IMaintenanceService, MaintenanceService>();
    }

    public static void RegisterFanexMailService(this IServiceCollection services)
    {
        AppSettings.AppMailId = AppSettingService.AppSetting.FanexMailService.AppMailId;
        AppSettings.AppMailAddress = AppSettingService.AppSetting.FanexMailService.AppMailAddress;
    }

    public static void RegisterBusinessServices(this IServiceCollection services)
    {
        services.RegisterTicketVoidingSystemServices();
        services.RegisterSharedApiServices();
        services.RegisterAbExceptionListServices();
        services.RegisterManageVoidServices();
        services.RegisterMarkTicketsServices();
        services.RegisterTicketListingServices();
        services.RegisterVoidSingleBetServices();
        services.RegisterAddRequestServices();
        services.RegisterManageRequestServices();
        services.RegisterVoidRequestServices();
        services.RegisterUploadBatchMessageServices();
        services.RegisterVirtualSportsVoidServices();
    }

    public static void RegisterMediatR(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(SharedApiController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(BetTypesController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MatchInfoController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ABExceptionListController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ManageVoidServicesController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MarkTicketsController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(TicketListingController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidSingleBetController).Assembly));

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AddRequestController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ManageRequestController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidRequestController).Assembly));

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(UploadBatchMessageController).Assembly));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(VoidParlaySubController).Assembly));
    }

    public static void RegisterAutoMapper(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(TicketVoidingSystemProfile));
        services.AddAutoMapper(typeof(SharedApiProfile));
        services.AddAutoMapper(typeof(MarkTicketsProfile));
        services.AddAutoMapper(typeof(TicketListingProfile));
        services.AddAutoMapper(typeof(VoidSingleBetProfile));
        services.AddAutoMapper(typeof(ManageRequestProfile));
        services.AddAutoMapper(typeof(VirtualSportsProfile));
    }
}