using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface CallApiAmendmentStage
{
    Task<AmendmentResponse> Execute(IEnumerable<LicenseeFile> licensees, string title, DateTime eventDate);
}

public class CallApiAmendmentStageImp(
    AmendmentOicHttpClientService amendmentOicHttpClientService,
    LoggingService loggingService)
    : CallApiAmendmentStage
{
    public async Task<AmendmentResponse> Execute(IEnumerable<LicenseeFile> licensees, string title, DateTime eventDate)
    {
        var query = CreateQuery(licensees, title, eventDate);
        var result = await amendmentOicHttpClientService.AmendmentOic(query);
        WriteLog(title, result);
        return result;
    }

    private static AmendmentOicQuery CreateQuery(IEnumerable<LicenseeFile> licensees, string title, DateTime eventDate)
    {
        var details = licensees.ToDictionary(item => item.LicenseeName, item => item.SessionID);

        return new AmendmentOicQuery
        {
            Title = title,
            EventDate = eventDate,
            ReceivedDate = DateTimeOffset.Now.DateTime.ZoneCanada(),
            SiteId = SiteAmendmentOic.SpecialDelete,
            Details = details
        };
    }

    private void WriteLog(string title, AmendmentResponse result)
    {
        loggingService.InfoAsync($"Amendment OIC: {title} - Date: {DateTimeOffset.Now} {Environment.NewLine}Result: {result.Code} - {result.Message}");
    }
}