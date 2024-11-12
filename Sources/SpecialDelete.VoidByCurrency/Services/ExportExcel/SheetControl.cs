using Epplus.Mapper.Extensions;
using Fanex.Data.Repository;
using OfficeOpenXml;
using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.VoidByCurrency.Services.ExportExcel;

public class SheetControlImp(
    SheetService sheetService,
    IDynamicRepository repository,
    MatchService matchService)
    : WorkSheetService<GetTicketsQuery>
{
    private readonly IDynamicRepository repository = repository;

    public async Task BindingContent(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        sheetService.AddTitle(worksheet, model.MatchId);
        var match = await matchService.GetMatchVoidByCurrency(model.MatchId);
        match = matchService.UpdateMatchInfoFromRemotingRef(match);
        sheetService.AddMatch(worksheet, match);

        var tickets = await sheetService.GetTickets(model);
        const int StartRowIndex = 8;
        worksheet.ApplyVertical(tickets, StartRowIndex);

        sheetService.SetStyle(worksheet);
    }
}