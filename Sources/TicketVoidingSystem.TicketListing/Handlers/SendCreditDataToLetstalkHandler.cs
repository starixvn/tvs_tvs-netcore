using System.Text;
using Fanex.LetstalkService.Core.Models;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.TicketListing.Criteria;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class SendCreditDataToLetstalkRequest : ExportExcelQuery, IRequest<Result>
{
}

public class SendCreditDataToLetstalkHandler : IRequestHandler<SendCreditDataToLetstalkRequest, Result>
{
    private readonly ExcelService<ExportExcelQuery> excelService;
    private readonly NotificationLetstalkService notificationLetstalkService;

    public SendCreditDataToLetstalkHandler(ExcelService<ExportExcelQuery> excelService, NotificationLetstalkService notificationLetstalkService)
    {
        this.excelService = excelService;
        this.notificationLetstalkService = notificationLetstalkService;
    }

    public async Task<Result> Handle(SendCreditDataToLetstalkRequest request, CancellationToken cancellationToken)
    {
        var sentResult = await notificationLetstalkService.SendToGroupTicketListing(CreateContent(request), await CreateAttachment(request));
        if (sentResult.IsSuccessful)
        {
            return new Result
            {
                ErrorCode = 0,
                ErrorMsg = "Data of Credit are sent successfully!"
            };
        }

        return new Result
        {
            ErrorCode = 1,
            ErrorMsg = "Failed to send data."
        };
    }

    private async Task<LetstalkAttachment> CreateAttachment(ExportExcelQuery query)
    {
        var excelAttachments = await excelService.GenerateContentAsByteArray(query, TemplateExcelPath.TicketListing);
        return new LetstalkAttachment
        {
            FileName = "Ticket_Listing_for_Bettype_Credit.xlsx",
            Bytes = excelAttachments
        };
    }

    private static string CreateContent(ExportExcelQuery query)
    {
        var content = new StringBuilder();
        content.AppendLine($"Event Date: {query.EventDate:dd MMMM yyyy}");
        content.AppendLine($"Match: {query.MatchEvent}");
        content.AppendLine($"Credit Total bet: {query.TotalCreditTickets}");

        return content.ToString();
    }
}