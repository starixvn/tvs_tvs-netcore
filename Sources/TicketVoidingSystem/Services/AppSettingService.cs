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
                CookieTimeOut = configuration.GetValue<int>($"{nameof(AuthSettings)}:{nameof(AuthSettings.CookieTimeOut)}"),
                SessionTimeOut = configuration.GetValue<int>($"{nameof(AuthSettings)}:{nameof(AuthSettings.SessionTimeOut)}"),
                LoginPath = configuration.GetValue<string>($"{nameof(AuthSettings)}:{nameof(AuthSettings.LoginPath)}"),
                LogoutPath = configuration.GetValue<string>($"{nameof(AuthSettings)}:{nameof(AuthSettings.LogoutPath)}")
            },
            RedisConfig = new RedisConfig
            {
                EndPoint = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.EndPoint)}"),
                Password = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.Password)}"),
                DefaultDatabase = configuration.GetValue<int>($"{nameof(RedisConfig)}:{nameof(RedisConfig.DefaultDatabase)}"),
                SignalRChannelPrefix = configuration.GetValue<string>($"{nameof(RedisConfig)}:{nameof(RedisConfig.SignalRChannelPrefix)}")
            },
            LetstalkConfig = new LetstalkConfig
            {
                ItGroup = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.ItGroup)}"),
                LetstalkServiceApi = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.LetstalkServiceApi)}"),
                VoidSettledBets = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.VoidSettledBets)}"),
                TicketListingAlert = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.TicketListingAlert)}"),
                TicketListingAlert777 = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.TicketListingAlert777)}"),
                AbnormalBetRequest = configuration.GetValue<string>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.AbnormalBetRequest)}"),
                IsProdEnv = configuration.GetValue<bool>($"{nameof(LetstalkConfig)}:{nameof(LetstalkConfig.IsProdEnv)}")
            },
            FanexRemotingRefServiceUrl = configuration.GetValue<string>(nameof(AppSettingModel.FanexRemotingRefServiceUrl)),
            ServiceName = configuration.GetValue<string>(nameof(AppSettingModel.ServiceName)),
            AmendmentApi = configuration.GetValue<string>(nameof(AppSettingModel.AmendmentApi)),
            OWPUrl = configuration.GetValue<string>(nameof(AppSettingModel.OWPUrl)),
            EnvironmentName = configuration.GetValue<string>(nameof(AppSettingModel.EnvironmentName)),
            JackTimeCashOutUrl = configuration.GetValue<string>(nameof(AppSettingModel.JackTimeCashOutUrl)),
            LinkedLogUrl = configuration.GetValue<string>(nameof(AppSettingModel.LinkedLogUrl)),
            FanexMailService = new FanexMailService
            {
                MailingList = configuration.GetValue<string>($"{nameof(FanexMailService)}:{nameof(FanexMailService.MailingList)}"),
                AppMailId = configuration.GetValue<string>($"{nameof(FanexMailService)}:{nameof(FanexMailService.AppMailId)}"),
                AppMailJollySportsId = configuration.GetValue<string>($"{nameof(FanexMailService)}:{nameof(FanexMailService.AppMailJollySportsId)}"),
                AppMailAddress = configuration.GetValue<string>($"{nameof(FanexMailService)}:{nameof(FanexMailService.AppMailAddress)}")
            },
            IgnoreSiteDb = configuration.GetValue<string>(nameof(AppSettingModel.IgnoreSiteDb))
        };

        AppSetting = setting;
    }
}