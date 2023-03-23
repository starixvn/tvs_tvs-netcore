namespace TicketVoidingSystem.Models
{
    public class AppSettingModel
    {
        public AuthSettings AuthSettings { get; init; }

        public RedisConfig RedisConfig { get; init; }

        // Sentry
        public string CategorySentryLog { get; init; }

        public string SentryClientKey { get; init; }

        public string FanexRemotingRefServiceUrl { get; init; }

        public string ServiceName { get; init; }
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
}