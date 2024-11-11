using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

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
    }
}