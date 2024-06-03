using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.WrongMarketOffered;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.AddRequest;

public static class AddRequestCommon
{
    public static void RegisterAddRequestServices(this IServiceCollection services)
    {
        services.AddTransient<GetTransInfoService, GetTransInfoServiceImp>();
        services.AddTransient<LogInfoService, LogInfoServiceImp>();
        services.AddTransient<AddRequestService, AddRequestServiceImp>();
        services.AddTransient<InsertAutoVoidRequestQueueService, InsertAutoVoidRequestQueueServiceImp>();
        services.AddTransient<MarkTicketsService, MarkTicketsServiceImp>();
        services.AddTransient<SendLetstalkAfterAddService, SendLetstalkAfterAddServiceImp>();
        services.AddTransient<BuildLogsDataService, BuildLogsDataServiceImp>();
        services.AddTransient<FilterLinkedLogService, FilterLinkedLogServiceImp>();
        services.AddTransient<GetLinkedLogService, GetLinkedLogServiceImp>();
        services.AddTransient<GetLinkedLogShowUiService, GetLinkedLogShowUiServiceImp>();
        services.AddTransient<GetPoolHouseTicketService, GetPoolHouseTicketServiceImp>();
        services.AddTransient<LinkedLogApiService, LinkedLogApiServiceImp>();
        services.AddTransient<LinkGroupBettypeService, LinkGroupBettypeServiceImp>();
        services.AddTransient<OddsInfoValidationService, OddsInfoValidationServiceImp>();
        services.AddTransient<MatchInfoAddRequestService, MatchInfoAddRequestServiceImp>();
        services.AddTransient<ReducedOverBetTypesService, ReducedOverBetTypesServiceImp>();
        services.AddTransient<NotParticipateBetTypesService, NotParticipateBetTypesServiceImp>();
        services.AddTransient<WrongMarketOfferedService, WrongMarketOfferedServiceImp>();
        services.RegisterAbnormalBetServices();
        services.RegisterAbnormalAccountServices();
    }
}