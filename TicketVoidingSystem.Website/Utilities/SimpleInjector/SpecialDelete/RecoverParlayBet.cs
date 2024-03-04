using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.RecoverParlayBet.Models;
using SpecialDelete.RecoverParlayBet.Repositories;
using SpecialDelete.RecoverParlayBet.Services;
using SpecialDelete.RecoverParlayBet.Services.GetTickets;
using SpecialDelete.RecoverParlayBet.Services.RecoverTickets;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class RecoverParlayBet
{
    public static void RegisterRecoverParlayBetServices(this IServiceCollection services)
    {
        services.AddTransient<PermissionService, PermissionServiceImp>();
        services.AddTransient<Repository, RepositoryImp>();
        services.AddScoped(typeof(BetListParlayService<GetSubTicket>), typeof(BetListSubParlayServiceImp<GetSubTicket>));
        services.AddScoped(typeof(BetListParlayService<RecoverSubTicketModel>), typeof(BetListSubParlayServiceImp<RecoverSubTicketModel>));

        services.AddScoped(typeof(BetListParlayService<GetMainTicket>), typeof(BetListMainParlayServiceImp<GetMainTicket>));
        services.AddScoped(typeof(BetListParlayService<RecoverMainTicketModel>), typeof(BetListMainParlayServiceImp<RecoverMainTicketModel>));

        services.AddScoped(typeof(DisplayedTicketService<>), typeof(DisplayedTicketServiceImp<>));
        services.AddScoped(typeof(GetTicketsService<,>), typeof(GetTicketsServiceImp<,>));
        services.AddTransient<global::SpecialDelete.RecoverParlayBet.Services.GetTickets.TicketsHandlerService<GetSubTicket, GetSubTicketsQuery>, SubTicketsHandlerServiceImp>();
        services.AddTransient<global::SpecialDelete.RecoverParlayBet.Services.GetTickets.TicketsHandlerService<GetMainTicket, GetMainTicketsQuery>, MainTicketsHandlerServiceImp>();

        services.AddTransient<RecordRecoverService<MailTicketViewModel, RecoverMainTicketModel>, RecordServiceImp<RecoverMainTicketModel>>();
        services.AddTransient<RecordRecoverService<MailTicketViewModel, RecoverSubTicketModel>, RecordServiceImp<RecoverSubTicketModel>>();
        services.AddScoped(typeof(RecoverTicketsService<,>), typeof(RecoverTicketsServiceImp<,>));
        services.AddTransient<SeparabilityService<RecoverSubTicketModel, RecoverSubTicketsQuery>, RecoverSubTicketsServiceImp>();
        services.AddTransient<SeparabilityService<RecoverMainTicketModel, RecoverMainTicketsQuery>, RecoverMainTicketsServiceImp>();
        services.AddScoped(typeof(global::SpecialDelete.RecoverParlayBet.Services.RecoverTickets.TicketsHandlerService<,>), typeof(TicketsHandlerServiceImp<,>));
    }
}