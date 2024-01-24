using System.Text;
using Fanex.LetstalkService.Core.Models;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class SendCreditDataToLetstalkRequest : ExportExcelQuery, IRequest<Result>
{
}

public class SendCreditDataToLetstalkHandler : IRequestHandler<SendCreditDataToLetstalkRequest, Result>
{
    private readonly ExcelService<ExportExcelQuery> excelService;
    private readonly NotificationLetstalkService notificationLetstalkService;
    private readonly GetTicketsService getTicketsService;

    public SendCreditDataToLetstalkHandler(ExcelService<ExportExcelQuery> excelService, NotificationLetstalkService notificationLetstalkService, GetTicketsService getTicketsService)
    {
        this.excelService = excelService;
        this.notificationLetstalkService = notificationLetstalkService;
        this.getTicketsService = getTicketsService;
    }

    public async Task<Result> Handle(SendCreditDataToLetstalkRequest request, CancellationToken cancellationToken)
    {
        var (isSentDataToSiteNormal, isSentDataToSite777) = await SendToGroupTicketListing(request);

        if (isSentDataToSiteNormal.IsSuccessful && isSentDataToSite777.IsSuccessful)
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
            ErrorMsg = GetErrorMessageError(isSentDataToSiteNormal.IsSuccessful, isSentDataToSite777.IsSuccessful)
        };
    }

    private static string GetErrorMessageError(bool isSentDataToSiteNormal, bool isSentDataToSite777)
    {
        if (!isSentDataToSiteNormal && !isSentDataToSite777)
        {
            return "Failed to send data.";
        }

        return isSentDataToSite777 ? "Failed to send data of Credit site 777" : "Failed to send data of Credit site Normal";
    }

    private async Task<(Result isSentDataToSiteNormal, Result isSentDataToSite777)> SendToGroupTicketListing(SendCreditDataToLetstalkRequest request)
    {
        var tickets = await getTicketsService.GetTicketsForExportExcel(request);
        var (ticketsCredit777, ticketsCreditNormal) = GroupTicketsTicketListingAlert(tickets);
        var isSentDataToSiteNormal = new Result();
        if (ticketsCreditNormal.Any())
        {
            request.TotalCreditTickets = ticketsCreditNormal.Count();
            request.Tickets = ticketsCreditNormal;
            isSentDataToSiteNormal = await notificationLetstalkService.SendToGroupTicketListing(CreateContent(request), await CreateAttachmentForCredit(request));
        }

        var isSentDataToSite777 = new Result();
        if (ticketsCredit777.Any())
        {
            request.TotalCreditTickets = ticketsCredit777.Count();
            request.Tickets = ticketsCredit777;
            isSentDataToSite777 = await notificationLetstalkService.SendToGroupTicketListing777(CreateContent(request), await CreateAttachmentForCredit777(request));
        }

        return (isSentDataToSiteNormal, isSentDataToSite777);
    }

    private async Task<LetstalkAttachment> CreateAttachmentForCredit(ExportExcelQuery query)
    {
        var excelAttachments = await excelService.GenerateContentAsByteArray(query, TemplateExcelPath.TicketListing);
        return new LetstalkAttachment
        {
            FileName = "Ticket_Listing_for_Bettype_Credit.xlsx",
            Bytes = excelAttachments
        };
    }

    private async Task<LetstalkAttachment> CreateAttachmentForCredit777(ExportExcelQuery query)
    {
        var excelAttachments = await excelService.GenerateContentAsByteArray(query, TemplateExcelPath.TicketListing);
        return new LetstalkAttachment
        {
            FileName = "Ticket_Listing_for_Bettype_Credit_777.xlsx",
            Bytes = excelAttachments
        };
    }

    private static (IEnumerable<ExcelTicketModel> ticketsCredit777, IEnumerable<ExcelTicketModel> ticketsCreditNormal) GroupTicketsTicketListingAlert(IEnumerable<ExcelTicketModel> tickets)
    {
        const string site777 = "777";
        var ticketsCredit777 = tickets.Where(x => x.Site == site777);
        var ticketsCreditNormal = tickets.Where(x => x.Site != site777);

        return (ticketsCredit777, ticketsCreditNormal);
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