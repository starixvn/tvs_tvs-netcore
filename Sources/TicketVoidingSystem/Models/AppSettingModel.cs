namespace TicketVoidingSystem.Models
{
    public class AppSettingModel
    {
        public AuthSettings AuthSettings { get; init; }

        public RedisConfig RedisConfig { get; init; }

        public LetstalkConfig LetstalkConfig { get; init; }

        // Sentry
        public string CategorySentryLog { get; init; }

        public string SentryClientKey { get; init; }

        //
        public string FanexRemotingRefServiceUrl { get; init; }

        public string ServiceName { get; init; }

        public string AmendmentApi { get; init; }

        public string EnvironmentName { get; init; }
    }

    public class AuthSettings
    {
        public int CookieTimeOut { get; set; }
        public int SessionTimeOut { get; set; }
        public string LoginPath { get; set; }
        public string LogoutPath { get; set; }
    }

    public class RedisConfig
    {
        public string EndPoint { get; set; }
        public string Password { get; set; }
        public int DefaultDatabase { get; set; }
        public string SignalRChannelPrefix { get; set; }
    }

    public class LetstalkConfig
    {
        public string VoidSettledBets { get; set; }
        public string TicketListingAlert { get; set; }
        public string AbnormalBetRequest { get; set; }
        public string LetstalkServiceApi { get; set; }
        public bool IsProdEnv { get; set; }
    }
}