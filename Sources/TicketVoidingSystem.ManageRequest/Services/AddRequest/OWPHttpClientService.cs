using System.Net.Mime;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface OWPHttpClientService
{
    public Task<OWPMaxBetAndSpreadInfo> GetMaxBetAndSpread(int matchId, int parentId, int subType);
}

public class OWPHttpClientServiceImp : OWPHttpClientService
{
    private readonly HttpClient httpClient;
    private readonly LoggingService loggingService;

    public OWPHttpClientServiceImp(HttpClient httpClient, LoggingService loggingService)
    {
        this.loggingService = loggingService;
        this.httpClient = httpClient;
        this.httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.OWPUrl);
        this.httpClient.Timeout = TimeSpan.FromMinutes(5);
        this.httpClient.DefaultRequestHeaders.Clear();
        this.httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task<OWPMaxBetAndSpreadInfo> GetMaxBetAndSpread(int matchId, int parentId, int subType)
    {
        var actionName = matchId.Equals(parentId)
            ? $"api/maxbet/{parentId}"
            : $"api/maxbet/{parentId}/{subType}";

        var response = await httpClient.GetAsync(actionName);
        if (response.IsSuccessStatusCode)
        {
            return await Helper.DeserializeResponseStream<OWPMaxBetAndSpreadInfo>(response);
        }

        await loggingService.ErrorAsync($"URL: {AppSettingService.AppSetting.OWPUrl}{actionName}{Environment.NewLine}Response:{Environment.NewLine}{response}");
        return new OWPMaxBetAndSpreadInfo();
    }
}