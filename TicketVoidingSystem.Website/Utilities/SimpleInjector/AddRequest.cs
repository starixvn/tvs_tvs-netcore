using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.ExportExcel;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class AddRequest
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
        services.AddTransient<CellService, CellServiceImp>();
        services.AddTransient<WorkSheetService<ExportTicketAbnormalBetQuery>, GetTicketsForExportExcelService>();
    }
}