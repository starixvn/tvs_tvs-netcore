using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class AddRequest
{
    public static void RegisterAddRequestServices(this IServiceCollection services)
    {
        services.AddTransient<GetTransInfoService, GetTransInfoServiceImp>();
        services.AddTransient<LogInfoService, LogInfoServiceImp>();
    }
}