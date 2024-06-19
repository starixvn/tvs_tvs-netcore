using System.Net.Mime;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface OWPMaxBetAndSpreadService
{
    public Task<OddsInfoModel> GetMaxBetAndSpread(OddsInfoRequest request);
}

public class OWPMaxBetAndSpreadServiceImp : OWPMaxBetAndSpreadService
{
    private readonly HttpClient httpClient;
    private readonly LoggingService loggingService;

    public OWPMaxBetAndSpreadServiceImp(HttpClient httpClient, LoggingService loggingService)
    {
        this.loggingService = loggingService;
        this.httpClient = httpClient;
        this.httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.AmendmentApi);
        this.httpClient.Timeout = TimeSpan.FromMinutes(5);
        this.httpClient.DefaultRequestHeaders.Clear();
        this.httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task<OddsInfoModel> GetMaxBetAndSpread(OddsInfoRequest query)
    {
        var response = await httpClient.PostAsync("api/maxbet", Helper.CreateRequestStringContent(query));
        var oddsInfo = new OddsInfoModel();
        if (response.IsSuccessStatusCode)
        {
            return await Helper.DeserializeResponseStream<OWPMaxBetAndSpreadInfo>(response);
        }

        await loggingService.ErrorAsync($"URL: {AppSettingService.AppSetting.AmendmentApi}api/maxbet{Environment.NewLine}Response:{Environment.NewLine}{response}");
        return oddsInfo;
    }

    private Task<OddsInfoModel> GetMaxBetAndSpread(OWPMaxBetAndSpreadInfo maxBetAndSpreadInfo, int subIssueTypeId)
    {
    }
}