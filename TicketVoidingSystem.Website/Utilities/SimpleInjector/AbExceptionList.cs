using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ABExceptionList.Services;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class AbExceptionList
{
    public static void RegisterAbExceptionListServices(this IServiceCollection services)
    {
        services.AddTransient<GetUsersService, GetUsersServiceImp>();
        services.AddTransient<AfterVoidService, AfterVoidServiceImp>();
        services.AddTransient<AutoVoidRequestQueueService, AutoVoidRequestQueueServiceImp>();
        services.AddTransient<TicketVoidingQueueService, TicketVoidingQueueServiceImp>();
        services.AddTransient<CheckingVoidStatusService, CheckingVoidStatusServiceImp>();
        services.AddTransient<VoidingHistoryService, VoidingHistoryServiceImp>();
    }
}