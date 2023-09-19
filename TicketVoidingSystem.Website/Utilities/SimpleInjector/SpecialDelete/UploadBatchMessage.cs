using Microsoft.Extensions.DependencyInjection;
using SpecialDelete.UploadBatchMessage.Repositories;
using SpecialDelete.UploadBatchMessage.Services;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.SpecialDelete;

public static class UploadBatchMessage
{
    public static void RegisterUploadBatchMessageServices(this IServiceCollection services)
    {
        services.AddTransient<UploadBatchMessageRepository, UploadBatchMessageRepositoryImp>();
        services.AddTransient<BatchMessageService, BatchMessageServiceImp>();
    }
}