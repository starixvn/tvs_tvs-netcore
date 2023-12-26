using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.RecoverBet.Models;
using SpecialDelete.RecoverBet.Repositories;
using SpecialDelete.RecoverBet.Services.RecoverTickets;
using SpecialDelete.RecoverBet.Services.RenderTicket;
using SpecialDelete.RecoverBet.ViewModels;
using TicketVoidingSystem.Services.SendEmail.Recover;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class RecoverBet
{
    public static void RegisterRecoverBetServices(this IServiceCollection services)
    {
        services.AddTransient<IRepository, Repository>();
        services.AddTransient<RecordRecoverService<MailTicketViewModel, RecoverTicketModel>, RecordService>();
        services.AddTransient<IRecoverTicketsService, RecoverTicketsService>();
        services.AddTransient<IHandleEmailService, HandleEmailService>();
        services.AddTransient<IBetListCoreService, BetListCoreService>();
        services.AddTransient<ITicketService, TicketService>();
    }
}