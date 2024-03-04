using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.Repositories;
using SpecialDelete.RecoverByBetId.Services.GetTickets;
using SpecialDelete.RecoverByBetId.Services.RecoverTickets;
using SpecialDelete.RecoverByBetId.ViewModels;
using TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class RecoverByBetId
{
    public static void RegisterRecoverByBetIdServices(this IServiceCollection services)
    {
        services.AddTransient<Repository, RepositoryImp>();
        services.AddTransient<BetListRecoverBetIdService, BetListRecoverBetIdServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<TicketService, TicketServiceImp>();
        services.AddTransient<RecordRecoverService<MailTicketViewModel, RecoverTicketModel>, RecordServiceImp>();
        services.AddTransient<RecoverTicketsService, RecoverTicketsServiceImp>();
    }
}