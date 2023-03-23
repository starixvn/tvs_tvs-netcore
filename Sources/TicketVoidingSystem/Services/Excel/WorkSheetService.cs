using System.Threading.Tasks;
using OfficeOpenXml;

namespace TicketVoidingSystem.Services.Excel
{
    public interface WorkSheetService<in T>
    {
        Task BindingContent(ExcelWorksheet worksheet, T model);
    }
}