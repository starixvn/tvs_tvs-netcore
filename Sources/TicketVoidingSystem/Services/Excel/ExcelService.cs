using System.IO;
using System.Threading.Tasks;
using OfficeOpenXml;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.Excel;

public interface ExcelService<in T>
{
    Task<byte[]> GenerateContentAsByteArray(T model, string templatePath);
}

public class ExcelServiceImp<T> : ExcelService<T>
{
    private readonly WorkSheetService<T> workSheetService;

    public ExcelServiceImp(WorkSheetService<T> workSheetService)
    {
        this.workSheetService = workSheetService;
    }

    public async Task<byte[]> GenerateContentAsByteArray(T model, string templatePath)
    {
        var fullFilePath = Helper.GetFilePath(templatePath);
        await using var stream = new FileStream(fullFilePath, FileMode.Open, FileAccess.Read);
        using var excelPackage = new ExcelPackage(stream);
        var worksheet = excelPackage.Workbook.Worksheets[0];
        await workSheetService.BindingContent(worksheet, model);

        return await excelPackage.GetAsByteArrayAsync();
    }
}