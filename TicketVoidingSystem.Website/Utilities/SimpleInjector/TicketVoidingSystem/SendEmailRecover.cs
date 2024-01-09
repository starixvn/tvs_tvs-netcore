using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.Services.SendEmail.Recover;
using TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.TicketVoidingSystem;

public static class SendEmailRecover
{
    public static void RegisterSendEmailRecoverServices(this IServiceCollection services)
    {
        services.AddScoped(typeof(EmailRecoverService<,>), typeof(EmailRecoverServiceImp<,>));

        services.AddScoped<BetListCoreService, BetListCoreServiceImp>();
        services.AddScoped<RecoverEmailContentService, RecoverEmailContentServiceImp>();
        services.AddScoped<RecoverTicketService, RecoverTicketServiceImp>();
        services.AddScoped<SendEmailRecoverService, SendEmailRecoverServiceImp>();
    }
}