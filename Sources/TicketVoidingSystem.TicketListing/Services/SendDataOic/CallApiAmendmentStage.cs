using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface CallApiAmendmentStage
{
    Task<AmendmentReponse> Execute(IEnumerable<LicenseeFile> licensees, string title, DateTime eventDate);
}

public class CallApiAmendmentStageImp : CallApiAmendmentStage
{
    private readonly AmendmentOicHttpClientService amendmentOicHttpClientService;
    private readonly LoggingService loggingService;

    public CallApiAmendmentStageImp(AmendmentOicHttpClientService amendmentOicHttpClientService, LoggingService loggingService)
    {
        this.amendmentOicHttpClientService = amendmentOicHttpClientService;
        this.loggingService = loggingService;
    }

    public async Task<AmendmentReponse> Execute(IEnumerable<LicenseeFile> licensees, string title, DateTime eventDate)
    {
        var query = CreateQuery(licensees, title, eventDate);
        var result = await amendmentOicHttpClientService.AmendmentOic(query);
        WriteLog(title, result);
        return result;
    }

    private static AmendmentOicQuery CreateQuery(IEnumerable<LicenseeFile> licensees, string title, DateTime eventDate)
    {
        var details = licensees.ToDictionary(item => item.Name, item => item.SessionID);

        return new AmendmentOicQuery
        {
            Title = title,
            EventDate = eventDate,
            ReceivedDate = DateTime.Now.ZoneCanada(),
            SiteId = SiteAmendmentOic.SpecialDelete,
            Details = details
        };
    }

    private void WriteLog(string title, AmendmentReponse result)
    {
        loggingService.InfoAsync($"Amendment OIC: {title} - Date: {DateTime.Now} {Environment.NewLine}Result: {result.Code} - {result.Message}");
    }
}