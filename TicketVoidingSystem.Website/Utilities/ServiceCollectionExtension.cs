using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
using MediatR;
using Microsoft.AspNetCore.Authentication.Cookies;
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
using TicketVoidingSystem.ABExceptionList.Controllers;
using TicketVoidingSystem.ABExceptionList.Services;
using TicketVoidingSystem.ManageVoidServices.Controllers;
using TicketVoidingSystem.ManageVoidServices.Services;
using TicketVoidingSystem.Services;
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
                options.Configuration.ChannelPrefix = configuration.GetSection("RedisConfig:ChannelPrefix").Value;
            });
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
            services.AddSingleton<LogActionFilterAttribute>();
            services.AddTransient<GetUsersService, GetUsersServiceImp>();
            services.AddTransient<AfterVoidService, AfterVoidServiceImp>();
            services.AddTransient<AutoVoidRequestQueueService, AutoVoidRequestQueueServiceImp>();
            services.AddTransient<TicketVoidingQueueService, TicketVoidingQueueServiceImp>();
            services.AddTransient<CheckingVoidStatusService, CheckingVoidStatusServiceImp>();
            services.AddTransient<VoidingHistoryService, VoidingHistoryServiceImp>();
        }

        public static void RegisterMediatR(this IServiceCollection services)
        {
            services.AddMediatR(typeof(ABExceptionListController));
            services.AddMediatR(typeof(ManageVoidServicesController));
        }
    }
}