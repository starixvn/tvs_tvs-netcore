namespace SpecialDelete.VoidByCurrency.Services.ExportExcel;

using System;
using System.Linq;
using System.Threading.Tasks;
using Common.Excel;
using Core.DTO;
using Epplus.Mapper.Extensions;
using Fanex.Data.Repository;
using Models;
using OfficeOpenXml;
using Criteria;

public class SheetControlImp : SheetControl<GetTicketsQuery>
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

    public void Binding(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        throw new NotImplementedException();
    }

    public async Task BindingAsync(ExcelWorksheet worksheet, GetTicketsQuery model)
    {
        sheetService.AddTitle(worksheet, model.MatchId);
        var criteria = new GetMatchCriteria { MatchId = model.MatchId };
        var match = repository.Fetch<Match>(criteria).FirstOrDefault();
        sheetService.AddMatch(worksheet, match);

        var tickets = await sheetService.GetTickets(model);
        const int StartRowIndex = 8;
        worksheet.ApplyVertical(tickets, StartRowIndex);

        sheetService.SetStyle(worksheet);
    }
}