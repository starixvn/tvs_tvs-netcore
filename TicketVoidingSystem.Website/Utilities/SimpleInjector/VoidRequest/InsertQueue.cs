using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.VoidRequest;

public static class InsertQueue
{
    public static void RegisterInsertQueueServices(this IServiceCollection services)
    {
        services.AddTransient<InsertQueueService, InsertQueueServiceImp>();
        services.AddTransient<MapTicketsService, MapTicketsServiceImp>();
        services.AddTransient<ValidationTicketsService, ValidationTicketsServiceImp>();
    }
}