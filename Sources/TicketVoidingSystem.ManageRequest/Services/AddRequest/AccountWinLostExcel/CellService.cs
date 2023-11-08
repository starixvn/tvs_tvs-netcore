using System.Drawing;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AccountWinLostExcel;

public interface CellService
{
    void SetStyle(ExcelWorksheet worksheet);
}

public class CellServiceImp : CellService
{
    public void SetStyle(ExcelWorksheet worksheet)
    {
        worksheet.Cells.Style.WrapText = true;
        var lastRow = worksheet.Dimension.End.Row;
        worksheet.HighlightBackground($"A8:O{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
    }
}