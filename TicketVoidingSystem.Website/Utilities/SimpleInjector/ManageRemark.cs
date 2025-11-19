using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class ManageRemark
{
    public static void AddManageRemarkServices(this IServiceCollection services)
    {
        services.AddTransient<AddRemarkService, AddRemarkServiceImp>();
        services.AddTransient<UpdateRemarkService, UpdateRemarkServiceImp>();
        services.AddTransient<GetRemarksService, GetRemarksServiceImp>();
        services.AddTransient<GetRemarksInActiveTableService, GetRemarksInActiveTableServiceImp>();
        services.AddTransient<GetRemarksInArchivedTableService, GetRemarksInArchivedTableServiceImp>();
        services.AddTransient<RenderRemarkService, RenderRemarkServiceImp>();
    }
}