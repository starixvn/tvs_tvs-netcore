using System.Configuration;
using System.Text;
using MediatR;

namespace TicketVoidingSystem.TicketListing.Handlers
{
    public class SendCreditDataToLetstalkRequest : ExportExcelQuery, IRequest<Result>
    {
    }

    public class SendCreditDataToLetstalkHandler : IAsyncRequestHandler<SendCreditDataToLetstalkRequest, Result>
    {
        private readonly ExcelService<ExportExcelQuery> excelService;
        private readonly NotificationLetstalkService notificationLetstalkService;

        public SendCreditDataToLetstalkHandler(ExcelService<ExportExcelQuery> excelService, NotificationLetstalkService notificationLetstalkService)
        {
            this.excelService = excelService;
            this.notificationLetstalkService = notificationLetstalkService;
        }

        public async Task<Result> Handle(SendCreditDataToLetstalkRequest message)
        {
            var dataAttachments = await GetDataAttachments(message);
            var isSentLetstalk = notificationLetstalkService.Send(CreateNotificationLetstalkModel(message, dataAttachments));
            var resultSendSucceed = new Result
            {
                ErrorCode = 0,
                ErrorMsg = "Data of Credit are sent successfully!"
            };
            var resultSendFailed = new Result
            {
                ErrorCode = 1,
                ErrorMsg = "Failed to send data."
            };

            return isSentLetstalk.IsSuccessful ? resultSendSucceed : resultSendFailed;
        }

        private static NotificationLetstalkModel CreateNotificationLetstalkModel(ExportExcelQuery query, byte[] attachment)
        {
            return new NotificationLetstalkModel
            {
                TargetName = "Ticket-Voiding-System",
                Subject = "Result Amendment Notification - Credit",
                Content = GetContentLetstalkModel(query),
                Group = ConfigurationManager.AppSettings["TVS-Ticket-Listing-Alert"],
                FileName = "Ticket_Listing_for_Bettype_Credit.xlsx",
                Attachment = attachment
            };
        }

        private async Task<byte[]> GetDataAttachments(ExportExcelQuery query)
        {
            var content = await excelService.CreateStreamAsync(query, TemplateExcel.TicketListing);
            content.Position = 0;
            var memoryStream = new MemoryStream();
            await content.CopyToAsync(memoryStream);

            return memoryStream.ToArray();
        }

        private static string GetContentLetstalkModel(ExportExcelQuery query)
        {
            var content = new StringBuilder();
            content.AppendLine($"Event Date: {query.EventDate:dd MMMM yyyy}");
            content.AppendLine($"Match: {query.MatchEvent}");
            content.AppendLine($"Credit Total bet: {query.TotalCreditTickets}");

            return content.ToString();
        }
    }
}