using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Extensions
{
    public static class ControllerExtension
    {
        private const string ExcelFileContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        public static FileContentResult ExcelFileResult(this ControllerBase controller, HttpResponse httpResponse, ExcelFileModel excelFile)
        {
            httpResponse.Headers.Add("Content-Disposition", $"attachment;filename={excelFile.FileName}.xlsx");

            return controller.File(excelFile.ContentAsByteArray, ExcelFileContentType);
        }
    }
}