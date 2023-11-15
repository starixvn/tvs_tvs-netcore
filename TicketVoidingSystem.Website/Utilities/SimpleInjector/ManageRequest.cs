using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.ExportExcel;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.Services.Excel;

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
        services.AddTransient<GetVoidedTicketsService, GetVoidedTicketsServiceImp>();
        services.AddTransient<MapFromBetListService, MapFromBetListServiceImp>();
        services.AddTransient<MapTicketsService, MapTicketsServiceImp>();
        services.AddTransient<GetGeneralInfoService, GetGeneralInfoServiceImp>();
        services.AddTransient<TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel.CellService,
            TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel.CellServiceImp>();
        services.AddTransient<GetVoidedTicketsForExcelService, GetVoidedTicketsForExcelServiceImp>();
        services.AddTransient<WorkSheetService<GetVoidedTicketsQuery>, GetVoidedTicketsWorkSheetService>();
        services.AddTransient<MapTicketsExcelService, MapTicketsExcelServiceImp>();
        services.AddTransient<CalculateTimeService, CalculateTimeServiceImp>();
        services.AddTransient<TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel.CellService,
            TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel.CellServiceImp>();
        services.AddTransient<ConvertRequestsService, ConvertRequestsServiceImp>();
        services.AddTransient<GetRequestsForExcelService, GetRequestsForExcelServiceImp>();
        services.AddTransient<WorkSheetService<SelectRequestsQuery>, RequestListWorksheetService>();
        services.AddTransient<EditRequestService, EditRequestServiceImp>();
        services.AddTransient<MarkTicketsWhenEditService, MarkTicketsWhenEditServiceImp>();
        services.AddTransient<ReCalculateTicketsService, ReCalculateTicketsServiceImp>();
        services.AddTransient<UpdateRequestProcessStage, UpdateRequestProcessStageImp>();
        services.AddTransient<MapAbnormalBetTicketsExcelService, MapAbnormalBetTicketsExcelServiceImp>();
    }
}