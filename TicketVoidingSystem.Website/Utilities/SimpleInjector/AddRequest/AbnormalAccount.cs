using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.AccountWinLostExcel;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.Website.Utilities.SimpleInjector.AddRequest;

public static class AbnormalAccount
{
    public static void RegisterAbnormalAccountServices(this IServiceCollection services)
    {
        services.AddTransient<CellService, CellServiceImp>();
        services.AddTransient<WorkSheetService<ExportAccountWinLostQuery>, AccountWinLostWorkSheetService>();

        services.AddTransient<CalculateHaveStatusWonNotLoseService, CalculateHaveStatusWonNotLoseServiceImp>();
        services.AddTransient<CalculateRemainStatusService, CalculateRemainStatusServiceImp>();
        services.AddTransient<CalculateVoidTicketsService, CalculateVoidTicketsServiceImp>();
        services.AddTransient<CombineVoidTicketsService, CombineVoidTicketsServiceImp>();
        services.AddTransient<EstimateVoidWonTicketsService, EstimateVoidWonTicketsServiceImp>();
        services.AddTransient<SortAlgorithmService, SortAlgorithmServiceImp>();

        services.AddTransient<AccountWinLostService, AccountWinLostServiceImp>();
        services.AddTransient<CheckUsernameService, CheckUsernameServiceImp>();
        services.AddTransient<CompressDataService, CompressDataAddRequestServiceImp>();
        services.AddTransient<GetTicketsService, GetTicketsServiceImp>();
    }
}