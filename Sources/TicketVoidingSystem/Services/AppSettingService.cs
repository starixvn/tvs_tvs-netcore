using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services
{
    public static class AppSettingService
    {
        public static AppSettingModel AppSetting { get; private set; }

        public static void InitSetting(IConfiguration configuration)
        {
            var setting = new AppSettingModel
            {
                AuthSettings = new AuthSettings
                {
                    CookieTimeOut = configuration.GetValue<int>($"{nameof(AuthSettings)}:{nameof(AuthSettings.CookieTimeOut)}"),
                    SessionTimeOut = configuration.GetValue<int>($"{nameof(AuthSettings)}:{nameof(AuthSettings.SessionTimeOut)}"),
                    LoginPath = configuration.GetValue<string>($"{nameof(AuthSettings)}:{nameof(AuthSettings.LoginPath)}"),
                    LogoutPath = configuration.GetValue<string>($"{nameof(AuthSettings)}:{nameof(AuthSettings.LogoutPath)}"),
                },
                RedisConfig = new RedisConfig
                {
                    EndPoint = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.EndPoint)}"),
                    Password = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.Password)}"),
                    DefaultDatabase = configuration.GetValue<int>($"{nameof(RedisConfig)}:{nameof(RedisConfig.DefaultDatabase)}"),
                    SignalRChannelPrefix = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.SignalRChannelPrefix)}")
                },
                CategorySentryLog = configuration.GetValue<string>(nameof(AppSettingModel.CategorySentryLog)),
                SentryClientKey = configuration.GetValue<string>(nameof(AppSettingModel.SentryClientKey)),
                FanexRemotingRefServiceUrl = configuration.GetValue<string>(nameof(AppSettingModel.FanexRemotingRefServiceUrl)),
                ServiceName = configuration.GetValue<string>(nameof(AppSettingModel.ServiceName))
            };

            AppSetting = setting;
        }
    }
}