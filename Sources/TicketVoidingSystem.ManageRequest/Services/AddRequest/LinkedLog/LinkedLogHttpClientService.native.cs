using System.Net.Mime;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface LinkedLogHttpClientService
{
    Task<IEnumerable<PoolHouseLinkedLogResponse>> GetLinkedLog(PoolHouseLinkedLogRequest requestData);
}

public class LinkedLogHttpClientServiceImp : LinkedLogHttpClientService
{
    private readonly HttpClient httpClient;
    private readonly LoggingService loggingService;

    public LinkedLogHttpClientServiceImp(HttpClient httpClient, LoggingService loggingService)
    {
        this.loggingService = loggingService;

        this.httpClient = httpClient;
        this.httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.LinkedLogUrl);
        this.httpClient.DefaultRequestHeaders.Accept.Clear();
        this.httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task<IEnumerable<PoolHouseLinkedLogResponse>> GetLinkedLog(PoolHouseLinkedLogRequest requestData)
    {
        const string actionName = "api/PoolHouse/GetLinkLog";
        var response = await httpClient.PostAsJsonAsync(actionName, requestData);
        if (response.IsSuccessStatusCode)
        {
            await loggingService.InfoAsync(await CreateLogResponse(actionName, response));
            return await response.Content.ReadAsAsync<IEnumerable<PoolHouseLinkedLogResponse>>();
        }

        await loggingService.InfoAsync(await CreateLogResponse(actionName, response));
        return null;
    }

    private static async Task<string> CreateLogResponse(string actionName, HttpResponseMessage response)
    {
        var requestContent = response.RequestMessage?.Content != null ? await response.RequestMessage.Content.ReadAsStringAsync() : string.Empty;
        var responseContent = await response.Content.ReadAsStringAsync();

        return $"{AppSettingService.AppSetting.LinkedLogUrl}{actionName}" +
               $"{Environment.NewLine}RequestContent:{Environment.NewLine}{requestContent}" +
               $"{Environment.NewLine}Response:{Environment.NewLine}{response}" +
               $"{Environment.NewLine}ResponseContent:{Environment.NewLine}{responseContent}";
    }
}