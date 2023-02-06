using System.Text;
using MediatR;
using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.TicketListing.Criteria;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class SendCreditDataToLetstalkRequest : ExportExcelQuery, IRequest<Result>
{
}

public class SendCreditDataToLetstalkHandler : IRequestHandler<SendCreditDataToLetstalkRequest, Result>
{
    private readonly IConfiguration configuration;
    private readonly ExcelService<ExportExcelQuery> excelService;
    private readonly NotificationLetstalkService notificationLetstalkService;

    public SendCreditDataToLetstalkHandler(ExcelService<ExportExcelQuery> excelService,
        NotificationLetstalkService notificationLetstalkService, IConfiguration configuration)
    {
        this.excelService = excelService;
        this.notificationLetstalkService = notificationLetstalkService;
        this.configuration = configuration;
    }

    public async Task<Result> Handle(SendCreditDataToLetstalkRequest request, CancellationToken cancellationToken)
    {
        var dataAttachments = await excelService.CreateFileAsByteArray(request, TemplateExcelPath.TicketListing);
        var isSentLetstalk = await notificationLetstalkService.Send(CreateNotificationLetstalkModel(request, dataAttachments));
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

    private NotificationLetstalkModel CreateNotificationLetstalkModel(ExportExcelQuery query, byte[] attachment)
    {
        return new NotificationLetstalkModel
        {
            TargetName = "Ticket-Voiding-System",
            Subject = "Result Amendment Notification - Credit",
            Content = GetContentLetstalkModel(query),
            Group = configuration["TVS-Ticket-Listing-Alert"],
            FileName = "Ticket_Listing_for_Bettype_Credit.xlsx",
            Attachment = attachment
        };
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