using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class ManageRequest
{
    public static void RegisterManageRequestServices(this IServiceCollection services)
    {
        services.AddTransient<DescriptionElementService, DescriptionElementServiceImp>();
        services.AddTransient<DescriptionService, DescriptionServiceImp>();
        services.AddTransient<GetRequestService, GetRequestServiceImp>();
        services.AddTransient<GetRequestsInActiveTableService, GetRequestsInActiveTableServiceImp>();
        services.AddTransient<GetRequestsInArchivedTableService, GetRequestsInArchivedTableServiceImp>();
        services.AddTransient<GetRequestsService, GetRequestsServiceImp>();
        services.AddTransient<RenderRequestService, RenderRequestServiceImp>();
        services.AddTransient<WrongScoreInfoService, WrongScoreInfoServiceImp>();
    }
}