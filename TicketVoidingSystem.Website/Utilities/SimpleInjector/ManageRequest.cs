using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.Services.Excel;
using CellServiceImpRequestListExcel = TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel.CellServiceImp;
using CellServiceImpVoidedTicketsExcel = TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel.CellServiceImp;
using CellServiceRequestListExcel = TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel.CellService;
using CellServiceVoidedTicketsExcel = TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel.CellService;

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
        services.AddTransient<CellServiceVoidedTicketsExcel, CellServiceImpVoidedTicketsExcel>();
        services.AddTransient<GetVoidedTicketsForExcelService, GetVoidedTicketsForExcelServiceImp>();
        services.AddTransient<WorkSheetService<GetVoidedTicketsQuery>, GetVoidedTicketsWorkSheetService>();
        services.AddTransient<MapTicketsExcelService, MapTicketsExcelServiceImp>();
        services.AddTransient<CalculateTimeService, CalculateTimeServiceImp>();
        services.AddTransient<CellServiceRequestListExcel, CellServiceImpRequestListExcel>();
        services.AddTransient<ConvertRequestsService, ConvertRequestsServiceImp>();
        services.AddTransient<GetRequestsForExcelService, GetRequestsForExcelServiceImp>();
        services.AddTransient<WorkSheetService<SelectRequestsQuery>, RequestListWorksheetService>();
        services.AddTransient<EditRequestService, EditRequestServiceImp>();
        services.AddTransient<MarkTicketsWhenEditService, MarkTicketsWhenEditServiceImp>();
        services.AddTransient<ReCalculateTicketsService, ReCalculateTicketsServiceImp>();
        services.AddTransient<UpdateRequestProcessStage, UpdateRequestProcessStageImp>();
    }
}