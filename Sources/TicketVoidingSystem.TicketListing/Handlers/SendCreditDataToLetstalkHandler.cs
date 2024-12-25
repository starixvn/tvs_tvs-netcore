using System.Text;
using Fanex.LetstalkService.Client.Models;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.TicketListing.Handlers;

public class SendCreditDataToLetstalkRequest : ExportExcelQuery, IRequest<Result>;

public class SendCreditDataToLetstalkHandler(
    ExcelService<ExportExcelQuery> excelService,
    NotificationLetstalkService notificationLetstalkService,
    GetTicketsService getTicketsService)
    : IRequestHandler<SendCreditDataToLetstalkRequest, Result>
{
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
            return "Failed to send data!";
        }

        return isSentDataToSite777 ? "Failed to send data of Credit site Normal!" : "Failed to send data of Credit site 777!";
    }

    private async Task<(Result isSentDataToSiteNormal, Result isSentDataToSite777)> SendToGroupTicketListing(ExportExcelQuery request)
    {
        var tickets = await getTicketsService.GetTicketsForExportExcel(request);
        var (ticketsCredit777, ticketsCreditNormal) = GroupTicketsTicketListingAlert(tickets);
        var isSentDataToSiteNormal = await SendForCreditNormal(ticketsCreditNormal, request);
        var isSentDataToSite777 = await SendForCredit777(ticketsCredit777, request);

        return (isSentDataToSiteNormal, isSentDataToSite777);
    }

    private async Task<Result> SendForCreditNormal(IEnumerable<ExcelTicketModel> ticketsCreditNormal, ExportExcelQuery request)
    {
        if (!ticketsCreditNormal.Any())
        {
            return new Result();
        }

        request.TotalCreditTickets = ticketsCreditNormal.Count();
        request.Tickets = ticketsCreditNormal;
        var attachment = new LetstalkAttachment
        {
            FileName = "Ticket_Listing_for_Bettype_Credit.xlsx",
            Bytes = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketListing)
        };
        return await notificationLetstalkService.SendToGroupTicketListing(CreateContent(request), attachment);

    }

    private async Task<Result> SendForCredit777(IEnumerable<ExcelTicketModel> ticketsCredit777, ExportExcelQuery request)
    {
        if (!ticketsCredit777.Any())
        {
            return new Result();
        }

        request.TotalCreditTickets = ticketsCredit777.Count();
        request.Tickets = ticketsCredit777;
        var attachment = new LetstalkAttachment
        {
            FileName = "Ticket_Listing_for_Bettype_Credit_777.xlsx",
            Bytes = await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketListing)
        };
        return await notificationLetstalkService.SendToGroupTicketListing777(CreateContent(request), attachment);

    }

    private static (IEnumerable<ExcelTicketModel> ticketsCredit777, IEnumerable<ExcelTicketModel> ticketsCreditNormal) GroupTicketsTicketListingAlert(IEnumerable<ExcelTicketModel> tickets)
    {
        var ticketsCredit777 = tickets.Where(x => x.IsSite777);
        var ticketsCreditNormal = tickets.Where(x => !x.IsSite777);

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