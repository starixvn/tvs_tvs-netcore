using System.IO;

namespace TicketVoidingSystem.Models
{
    public class ExcelFileModel
    {
        public Stream Content { get; set; }

        public byte[] ContentAsByteArray { get; set; }
        public static string ContentType => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        public string FileName { get; set; }
    }
}