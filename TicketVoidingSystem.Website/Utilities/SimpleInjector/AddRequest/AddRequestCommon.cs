using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.PoolHouse;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.AddRequest;

public static class AddRequestCommon
{
    public static void AddAddRequestServices(this IServiceCollection services)
    {
        services.AddTransient<GetTransInfoService, GetTransInfoServiceImp>();
        services.AddTransient<LogInfoService, LogInfoServiceImp>();
        services.AddTransient<GetVoidTimeByAllowanceSettingService, GetVoidTimeByAllowanceSettingServiceImp>();
        services.AddTransient<AddRequestService, AddRequestServiceImp>();
        services.AddTransient<AddRequestProcessStage, AddRequestProcessStageImp>();
        services.AddTransient<GetUpdateResultService, GetUpdateResultServiceImp>();
        services.AddTransient<InsertAutoVoidRequestQueueService, InsertAutoVoidRequestQueueServiceImp>();
        services.AddTransient<MarkTicketsService, MarkTicketsServiceImp>();
        services.AddTransient<MarkTicketsWhenAddEditService, MarkTicketsWhenAddEditServiceImp>();
        services.AddTransient<SendLetstalkAfterAddService, SendLetstalkAfterAddServiceImp>();
        services.AddTransient<LinkedLogForUIService, LinkedLogForUIServiceImp>();
        services.AddTransient<FilterLinkedLogService, FilterLinkedLogServiceImp>();
        services.AddTransient<GetLinkedLogService, GetLinkedLogServiceImp>();
        services.AddTransient<GeneratePoolHouseTicketService, GeneratePoolHouseTicketServiceImp>();
        services.AddTransient<GetPoolHouseTicketService, GetPoolHouseTicketServiceImp>();
        services.AddTransient<LinkGroupBettypeService, LinkGroupBettypeServiceImp>();
        services.AddTransient<LinkedLogValidationService, LinkedLogValidationServiceImp>();
        services.AddTransient<MatchInfoAddRequestService, MatchInfoAddRequestServiceImp>();
        services.AddTransient<ReducedOverBetTypesService, ReducedOverBetTypesServiceImp>();
        services.AddTransient<NotParticipateBetTypesService, NotParticipateBetTypesServiceImp>();
        services.AddTransient<AdvancedModeService, AdvancedModeServiceImp>();
        services.AddTransient<GetLogInfoTicketsService, GetLogInfoTicketsServiceImp>();
        services.AddTransient<GetDecidedByService, GetDecidedByServiceImp>();
        services.AddTransient<CheckProviderMistakeTicketsService, CheckProviderMistakeTicketsServiceImp>();
        services.AddTransient<AddRequestAutoVoidProviderMistakeService, AddRequestAutoVoidProviderMistakeServiceImp>();
        services.RegisterAbnormalBetServices();
        services.RegisterAbnormalAccountServices();
    }
}