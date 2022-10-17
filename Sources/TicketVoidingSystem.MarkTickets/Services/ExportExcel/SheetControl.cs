namespace TicketVoidingSystem.MarkTickets.Services.ExportExcel
{
    using System;
    using System.Threading.Tasks;
    using Criteria;

    public class SheetControlImp : SheetControl<GetTicketsQuery>
    {
        private readonly ISheetService sheetService;

        public SheetControlImp(ISheetService sheetService)
        {
            this.sheetService = sheetService;
        }

        public void Binding(ExcelWorksheet worksheet, GetTicketsQuery model)
        {
            const int startRow = 8;
            worksheet.Cells[1, 1].Value = sheetService.CreateTitle(model.MatchId);
            if (model.MatchId > 0)
            {
                sheetService.AddMatch(worksheet, model.Match);
            }
            var tickets = sheetService.GetTickets(model);
            worksheet.ApplyVertical(tickets, startRow);
            sheetService.SetStyle(worksheet);
        }

        public Task BindingAsync(ExcelWorksheet worksheet, GetTicketsQuery model)
        {
            throw new NotImplementedException();
        }
    }

    public class SheetControlDetailTicketImp : SheetControl<GetDetailTicketsQuery>
    {
        private readonly ISheetService sheetService;

        public SheetControlDetailTicketImp(ISheetService sheetService)
        {
            this.sheetService = sheetService;
        }

        public void Binding(ExcelWorksheet worksheet, GetDetailTicketsQuery model)
        {
            const int startRow = 8;
            worksheet.Cells[1, 1].Value = sheetService.CreateTitle(model.MatchId);
            if (model.MatchId > 0)
            {
                sheetService.AddMatch(worksheet, model.Match);
            }
            var tickets = sheetService.GetDetailTickets(model);
            worksheet.ApplyVertical(tickets, startRow);
            sheetService.SetStyle(worksheet);
        }

        public Task BindingAsync(ExcelWorksheet worksheet, GetDetailTicketsQuery model)
        {
            throw new NotImplementedException();
        }
    }
}