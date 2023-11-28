using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using SpecialDelete.CashOutTransaction.RecoverTickets.Models;
using SpecialDelete.CashOutTransaction.RecoverTickets.Services;
using TicketVoidingSystem.Services.SendEmail.Recover;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class CashOutTransactionRecover
{
    public static void RegisterRecoverCashOutTransactionServices(this IServiceCollection services)
    {
        services.AddTransient<HandlerService, HandlerServiceImp>();
        services.AddTransient<DisplayUiService, DisplayUiServiceImp>();
        services.AddTransient<RecoverService, RecoverServiceImp>();

        services.AddTransient<RecordRecoverService<MailTicketViewModel, RecoverTicketModel>, RecordServiceImp>();
    }
}