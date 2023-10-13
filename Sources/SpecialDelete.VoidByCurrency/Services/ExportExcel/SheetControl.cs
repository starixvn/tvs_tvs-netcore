using Epplus.Mapper.Extensions;
using Fanex.Data.Repository;
using OfficeOpenXml;
using SpecialDelete.VoidByCurrency.Models;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.Excel;

namespace SpecialDelete.VoidByCurrency.Services.ExportExcel;

public class SheetControlImp : WorkSheetService<GetTicketsQuery>
{
    private readonly SheetService sheetService;
    private readonly IDynamicRepository repository;

    public SheetControlImp(
        SheetService sheetService,
        IDynamicRepository repository)
    {
        this.sheetService = sheetService;
        this.repository = repository;
    }

    public async Task BindingContent(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        sheetService.AddTitle(worksheet, model.MatchId);
        var criteria = new GetMatchInfoVoidByCurrencyCriteria { MatchId = model.MatchId };
        var match = (await repository.FetchAsync<Match>(criteria)).FirstOrDefault();
        sheetService.AddMatch(worksheet, match);

        var tickets = await sheetService.GetTickets(model);
        const int StartRowIndex = 8;
        worksheet.ApplyVertical(tickets, StartRowIndex);

        sheetService.SetStyle(worksheet);
    }
}