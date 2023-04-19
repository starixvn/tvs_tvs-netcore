using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class ManageVoidServices
{
    public static void RegisterManageVoidServices(this IServiceCollection services)
    {
        services.AddTransient<AfterVoidService, AfterVoidServiceImp>();
        services.AddTransient<AutoVoidRequestQueueService, AutoVoidRequestQueueServiceImp>();
        services.AddTransient<TicketVoidingQueueService, TicketVoidingQueueServiceImp>();
        services.AddTransient<VoidingHistoryService, VoidingHistoryServiceImp>();
        services.AddTransient<LetstalkService, LetstalkServiceImp>();
    }
}