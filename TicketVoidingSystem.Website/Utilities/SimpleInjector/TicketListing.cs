using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.ExportExcel;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector;

public static class TicketListing
{
    public static void RegisterTicketListingServices(this IServiceCollection services)
    {
        services.AddTransient<CellService, CellServiceImp>();
        services.AddTransient<ConvertBetListForExcelService, ConvertBetListForExcelServiceImp>();
        services.AddTransient<WorkSheetService<ExportExcelQuery>, GetTicketsWorkSheetService>();
        services.AddTransient<AmendmentOicHttpClientService, AmendmentOicHttpClientServiceImp>();
        services.AddTransient<CallApiAmendmentStage, CallApiAmendmentStageImp>();
        services.AddTransient<InsertToAmendmentTableStage, InsertToAmendmentTableStageImp>();
        services.AddTransient<SendDataToOicService, SendDataToOicServiceImp>();
        services.AddTransient<AffectTicketsFromSettlementHistoryService, AffectTicketsFromSettlementHistoryServiceImp>();
        services.AddTransient<GetSummaryTicketsService, GetSummaryTicketsServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
        services.AddTransient<MapTicketService, MapTicketServiceImp>();
    }
}