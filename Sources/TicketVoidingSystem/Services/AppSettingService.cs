using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services;

public static class AppSettingService
{
    public static AppSettingModel AppSetting { get; private set; }

    public static void InitSetting(IConfiguration configuration)
    {
        var setting = new AppSettingModel
        {
            AuthSettings = new AuthSettings
            {
                CookieTimeOut = configuration.GetValue<int>($"{nameof(AuthSettings)}:{nameof(AuthSettings.CookieTimeOut)}", default),
                SessionTimeOut = configuration.GetValue<int>($"{nameof(AuthSettings)}:{nameof(AuthSettings.SessionTimeOut)}", default),
                LoginPath = configuration.GetValue<string>($"{nameof(AuthSettings)}:{nameof(AuthSettings.LoginPath)}", default),
                LogoutPath = configuration.GetValue<string>($"{nameof(AuthSettings)}:{nameof(AuthSettings.LogoutPath)}", default),
            },
            RedisConfig = new RedisConfig
            {
                EndPoint = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.EndPoint)}", default),
                Password = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.Password)}", default),
                DefaultDatabase = configuration.GetValue<int>($"{nameof(RedisConfig)}:{nameof(RedisConfig.DefaultDatabase)}", default),
                SignalRChannelPrefix = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.SignalRChannelPrefix)}", default)
            },
            LetstalkConfig = new LetstalkConfig
            {
                LetstalkServiceApi = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.LetstalkServiceApi)}", default),
                VoidSettledBets = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.VoidSettledBets)}", default),
                TicketListingAlert = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.TicketListingAlert)}", default),
                AbnormalBetRequest = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.AbnormalBetRequest)}", default),
                IsProdEnv = configuration.GetValue<bool>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.IsProdEnv)}", default)
            },
            CategorySentryLog = configuration.GetValue<string>(nameof(AppSettingModel.CategorySentryLog), default),
            SentryClientKey = configuration.GetValue<string>(nameof(AppSettingModel.SentryClientKey), default),
            FanexRemotingRefServiceUrl = configuration.GetValue<string>(nameof(AppSettingModel.FanexRemotingRefServiceUrl), default),
            ServiceName = configuration.GetValue<string>(nameof(AppSettingModel.ServiceName), default),
            AmendmentApi = configuration.GetValue<string>(nameof(AppSettingModel.AmendmentApi), default),
            EnvironmentName = configuration.GetValue<string>(nameof(AppSettingModel.EnvironmentName), default)
        };

        AppSetting = setting;
    }
}