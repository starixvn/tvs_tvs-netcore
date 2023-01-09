using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.BetList.Core;
using Fanex.BetList.Core.RemotingRef;
using Fanex.Data;
using Fanex.Data.Repository;
using Fanex.Data.SqlServer;
using Fanex.Logging;
using Fanex.Logging.Extensions;
using Fanex.Logging.Extensions.AspNetCore;
using Fanex.Logging.Extensions.Database;
using Fanex.Logging.Sentry;
using Fanex.NAP.Client.AspNetCore.Configuration;
using Fanex.NAP.Client.AspNetCore.Session;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Services;
using Fanex.RemotingRef;
using MediatR;
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
using Sentry;
using StackExchange.Redis;
using TicketVoidingSystem.ABExceptionList.Controllers;
using TicketVoidingSystem.ABExceptionList.Services;
using TicketVoidingSystem.ManageVoidServices.Controllers;
using TicketVoidingSystem.ManageVoidServices.Services;
using TicketVoidingSystem.MarkTickets.Controllers;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ExportExcel;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.SharedApi.Controllers;
using TicketVoidingSystem.SharedApi.Services;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SignalR;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.Website.Utilities
{
    public static class ServiceCollectionExtension
    {
        public static void RegisterFanexData(this IServiceCollection services, IConfiguration configuration)
        {
            var connections = configuration.GetSection("ConnectionStrings")
                .GetChildren()
                .AsEnumerable()
                .ToDictionary(
                    x => x.Key,
                    y => new ConnectionConfiguration(y.Key, y.Value)
                );

            DbSettingProviderManager
                .StartNewSession()
                .Use(connections)
                .WithSqlServer()
                .UseDefaultDbSettingProvider(configuration.GetSection("StoredProcedurePath").Value)
                .Run();
        }

        public static void RegisterSentry(this IServiceCollection services, IConfiguration configuration)
        {
            LogManager
                .SetDefaultLogCategory(configuration.GetSection("CategorySentryLog").Value)
                .Use(new List<ILogEngine>
                {
                    new SentryLogging(new SentryEngineOptions
                    {
                        Dsn = new Dsn(configuration.GetSection("SentryClientKey").Value)
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

        public static void RegisterAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    //// options.LoginPath = Configuration.GetSection("AuthSettings:LoginPath").Value;
                    //// options.LogoutPath = Configuration.GetSection("AuthSettings:LogoutPath").Value;
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(int.Parse(configuration.GetSection("AuthSettings:CookieTimeOut").Value));
                    options.Cookie = new CookieBuilder
                    {
                        Name = "TicketVoidingSystem.Cookie",
                        SecurePolicy = CookieSecurePolicy.SameAsRequest
                    };
                    options.Events.OnRedirectToLogin = (context) =>
                    {
                        context.Response.Redirect(configuration.GetSection("AuthSettings:LoginPath").Value);
                        return Task.CompletedTask;
                    };
                    options.Events.OnSigningOut = context =>
                    {
                        context.Response.Redirect(options.LoginPath);
                        return Task.CompletedTask;
                    };
                });

            var redisConfig = new ConfigurationOptions();
            redisConfig.EndPoints.Add(configuration.GetSection("RedisConfig:EndPoint").Value);
            redisConfig.Password = configuration.GetSection("RedisConfig:Password").Value;
            redisConfig.DefaultDatabase = int.Parse(configuration.GetSection("RedisConfig:DefaultDatabase").Value);
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
                options.IdleTimeout = TimeSpan.FromMinutes(int.Parse(configuration.GetSection("AuthSettings:SessionTimeOut").Value));
                options.Cookie.Name = "TicketVoidingSystem.Session";
            });
        }

        public static void RegisterSignalR(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSignalR().AddStackExchangeRedis(options =>
            {
                options.Configuration.EndPoints.Add(configuration.GetSection("RedisConfig:EndPoint").Value);
                options.Configuration.Password = configuration.GetSection("RedisConfig:Password").Value;
                options.Configuration.DefaultDatabase = int.Parse(configuration.GetSection("RedisConfig:DefaultDatabase").Value);
                options.Configuration.ChannelPrefix = configuration.GetSection("RedisConfig:SignalRChannelPrefix").Value;
            });
        }

        public static void RegisterRemotingRef(this IServiceCollection services, IConfiguration configuration)
        {
            RefDataTypeContainer
                .ConnectTo(new Uri(configuration.GetSection("FanexRemotingRefServiceUrl").Value))
                .FromApplication(configuration.GetSection("ServiceName").Value)
                .RegisterSupportedLanguages("en-US", "zh-TW", "zh-CN", "zh-Hans");

            BetListManager.RegisterRemotingRef(new CacheRef());
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
            services.AddSingleton<CheckUMFilterAttribute>();
            services.AddSingleton<IRemotingRefService, RemotingRefService>();
        }

        public static void RegisterONEbookUM(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton(new UMClientConfiguration().Initialize(configuration));
            services.AddSingleton<IUMCacheService, UMCacheService>();
            services.AddSingleton<IUMRestClient, UMRestClient>();
            services.AddSingleton<IPHelper, IPHelperImpl>();
            services.AddSingleton<IHttpContextHelper, HttpContextHelper>();
            services.AddSingleton<IMaintenanceService, MaintenanceService>();
        }

        public static void RegisterBusinessServices(this IServiceCollection services)
        {
            services.AddSingleton<SessionService, SessionServiceImp>();
            services.AddSingleton<LoggingService, LoggingServiceImp>();
            services.AddSingleton<PagingService, PagingServiceImp>();
            services.AddSingleton<LoggingService, LoggingServiceImp>();
            services.AddScoped(typeof(ExcelService<>), typeof(ExcelServiceImp<>));
            services.AddSingleton<RemotingRefWrapperService, RemotingRefWrapperServiceImp>();
            services.AddSingleton<BetListService, BetListServiceImp>();
            services.AddSingleton<OddsService, OddsServiceImp>();
            services.AddSingleton<MatchService, MatchServiceImp>();
            services.AddSingleton<LogActionFilterAttribute>();

            // Shared Api
            services.AddTransient<BetTypesService, BetTypesServiceImp>();
            services.AddTransient<BetTypesRepository, BetTypesRepositoryImp>();
            services.AddTransient<BetTeamsService, BetTeamsServiceImp>();
            services.AddTransient<BalanceUpService, BalanceUpServiceImp>();

            // AB Exception List
            services.AddTransient<GetUsersService, GetUsersServiceImp>();
            services.AddTransient<AfterVoidService, AfterVoidServiceImp>();
            services.AddTransient<AutoVoidRequestQueueService, AutoVoidRequestQueueServiceImp>();
            services.AddTransient<TicketVoidingQueueService, TicketVoidingQueueServiceImp>();
            services.AddTransient<VoidingHistoryService, VoidingHistoryServiceImp>();
            services.AddTransient<LetstalkService, LetstalkServiceImp>();

            // Mark Tickets
            services.AddTransient<CombineValidationService, CombineValidationServiceImp>();
            services.AddTransient<ConfirmAutoUnmarkService, ConfirmAutoUnmarkServiceImp>();
            services.AddTransient<MapDataForConfirmAutoUnmarkService, MapDataForConfirmAutoUnmarkServiceImp>();
            services.AddTransient<UpdateConfirmAutoUnmarkService, UpdateConfirmAutoUnmarkServiceImp>();
            services.AddTransient<CellService, CellServiceImp>();
            services.AddTransient<WorkSheetService<GetDetailTicketsQuery>, GetDetailTicketsWorkSheetService>();
            services.AddTransient<WorkSheetService<GetTicketsQuery>, GetTicketsWorkSheetService>();
            services.AddTransient<CheckBoxService, CheckBoxServiceImp>();
            services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
            services.AddTransient<MapTicketService, MapTicketServiceImp>();
            services.AddTransient<MarkTicketsService, MarkTicketsServiceImp>();
            services.AddTransient<MarkAllTicketsService, MarkAllTicketsServiceImp>();
            services.AddTransient<MapUserLogsService, MapUserLogsServiceImp>();
            services.AddTransient<UserLogsService, UserLogsServiceImp>();
        }

        public static void RegisterMediatR(this IServiceCollection services)
        {
            services.AddMediatR(typeof(SharedApiController));
            services.AddMediatR(typeof(BetTypesController));
            services.AddMediatR(typeof(MatchInfoController));
            services.AddMediatR(typeof(ABExceptionListController));
            services.AddMediatR(typeof(ManageVoidServicesController));
            services.AddMediatR(typeof(MarkTicketsController));
        }

        public static void RegisterAutoMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MarkTicketsController));
        }
    }
}