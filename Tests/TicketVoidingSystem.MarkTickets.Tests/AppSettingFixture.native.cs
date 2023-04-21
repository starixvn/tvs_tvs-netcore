using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Tests;

public class AppSettingFixture
{
    public AppSettingFixture()
    {
        IConfiguration config = new ConfigurationBuilder().Build();
        AppSettingService.InitSetting(config);
    }
}