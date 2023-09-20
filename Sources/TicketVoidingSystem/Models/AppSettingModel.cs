namespace TicketVoidingSystem.Models;

public class AppSettingModel
{
    public AuthSettings AuthSettings { get; init; }

    public RedisConfig RedisConfig { get; init; }

    public LetstalkConfig LetstalkConfig { get; init; }

    // Sentry
    public string CategorySentryLog { get; init; }

    public string SentryClientKey { get; init; }

    public string FanexRemotingRefServiceUrl { get; init; }

    public string ServiceName { get; init; }

    public string AmendmentApi { get; init; }

    public string EnvironmentName { get; init; }

    public string IgnoreSiteDb { get; init; }
    public string JackTimeCashOutUrl { get; init; }

    public FanexMailService FanexMailService { get; init; }

    public string TicketVoidingSystemUrl { get; init; }

    public string OldSiteRootUrl { get; init; }

    public string LinkedLogUrl { get; set; }
}

public class AuthSettings
{
    public int CookieTimeOut { get; init; }
    public int SessionTimeOut { get; init; }
    public string LoginPath { get; init; }
    public string LogoutPath { get; init; }
}

public class RedisConfig
{
    public string EndPoint { get; init; }
    public string Password { get; init; }
    public int DefaultDatabase { get; init; }
    public string SignalRChannelPrefix { get; init; }
}

public class LetstalkConfig
{
    public string VoidSettledBets { get; init; }
    public string TicketListingAlert { get; init; }
    public string AbnormalBetRequest { get; init; }
    public string LetstalkServiceApi { get; init; }
    public bool IsProdEnv { get; set; }
}

public class FanexMailService
{
    public string MailingList { get; init; }
    public string AppMailId { get; init; }
    public string AppMailAddress { get; init; }
}