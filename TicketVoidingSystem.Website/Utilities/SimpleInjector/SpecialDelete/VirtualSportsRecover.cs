using Microsoft.Extensions.DependencyInjection;
using Settlement.Business;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class VirtualSportsRecover
{
    public static void AddVirtualSportsRecoverServices(this IServiceCollection services)
    {
        services.AddTransient<Repository, RepositoryImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<RecoverBetListService, RecoverBetListServiceImp>();
        services.AddTransient<EmailRecordService, EmailRecordServiceImp>();
        services.AddTransient<EmailService, EmailServiceImp>();
        services.AddTransient<NotificationService, NotificationServiceImp>();
        services.AddTransient<RecoverTicketsService, RecoverTicketsServiceImp>();
        services.AddTransient<RecoverBetService, RecoverBetServiceImp>();
        services.AddTransient<CalculateService, CalculateServiceImp>();
        services.AddTransient<TicketsService, TicketsServicesImp>();
        services.AddTransient<ProcessRecoverService, ProcessRecoverServiceImp>();
        services.AddTransient<RecoverRacingService, RecoverRacingServiceImp>();
        services.AddTransient<WinLimitService, WinLimitServiceImp>();
        services.AddTransient<HistoryDataService, HistoryDataServiceImp>();
        services.AddSettlementBusinessServices();
    }
}