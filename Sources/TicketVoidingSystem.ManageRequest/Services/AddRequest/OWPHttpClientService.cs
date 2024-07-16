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
        try
        {
            var response = await httpClient.GetAsync(actionName);
            if (response.IsSuccessStatusCode)
            {
                await loggingService.InfoAsync(await CreateLogResponse(actionName, response));
                return await Helper.DeserializeResponseStream<OWPMaxBetAndSpreadInfo>(response);
            }
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync($"URL: {AppSettingService.AppSetting.OWPUrl}{actionName}{Environment.NewLine}Response:{Environment.NewLine}{exception}");
        }

        return null;
    }

    private static async Task<string> CreateLogResponse(string actionName, HttpResponseMessage response)
    {
        var requestContent = response.RequestMessage?.Content != null ? await response.RequestMessage.Content.ReadAsStringAsync() : string.Empty;
        var responseContent = await response.Content.ReadAsStringAsync();

        return $"{AppSettingService.AppSetting.JackTimeCashOutUrl}{actionName}" +
               $"{Environment.NewLine}RequestContent:{Environment.NewLine}{requestContent}" +
               $"{Environment.NewLine}Response:{Environment.NewLine}{response}" +
               $"{Environment.NewLine}ResponseContent:{Environment.NewLine}{responseContent}";
    }
}