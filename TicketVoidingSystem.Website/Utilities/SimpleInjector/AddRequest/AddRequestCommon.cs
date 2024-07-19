using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.WrongMarketOffered;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.AddRequest;

public static class AddRequestCommon
{
    public static void RegisterAddRequestServices(this IServiceCollection services)
    {
        services.AddTransient<GetTransInfoService, GetTransInfoServiceImp>();
        services.AddTransient<LogInfoService, LogInfoServiceImp>();
        services.AddTransient<LogInfoHelperService, LogInfoHelperServiceImp>();
        services.AddTransient<AddRequestService, AddRequestServiceImp>();
        services.AddTransient<InsertAutoVoidRequestQueueService, InsertAutoVoidRequestQueueServiceImp>();
        services.AddTransient<MarkTicketsService, MarkTicketsServiceImp>();
        services.AddTransient<SendLetstalkAfterAddService, SendLetstalkAfterAddServiceImp>();
        services.AddTransient<LinkedLogForUIService, LinkedLogForUIServiceImp>();
        services.AddTransient<FilterLinkedLogService, FilterLinkedLogServiceImp>();
        services.AddTransient<GetLinkedLogService, GetLinkedLogServiceImp>();
        services.AddTransient<GetPoolHouseTicketService, GetPoolHouseTicketServiceImp>();
        services.AddTransient<LinkGroupBettypeService, LinkGroupBettypeServiceImp>();
        services.AddTransient<LinkedLogValidationService, LinkedLogValidationServiceImp>();
        services.AddTransient<MatchInfoAddRequestService, MatchInfoAddRequestServiceImp>();
        services.AddTransient<ReducedOverBetTypesService, ReducedOverBetTypesServiceImp>();
        services.AddTransient<NotParticipateBetTypesService, NotParticipateBetTypesServiceImp>();
        services.AddTransient<WrongMarketOfferedService, WrongMarketOfferedServiceImp>();
        services.AddTransient<GetLiveGameEarlyTicketService, GetLiveGameEarlyTicketServiceImp>();
        services.AddTransient<DecompressDataService, DecompressDataServiceImp>();
        services.RegisterAbnormalBetServices();
        services.RegisterAbnormalAccountServices();
    }
}