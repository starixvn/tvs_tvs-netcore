using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Mime;
using System.Threading.Tasks;

namespace TicketVoidingSystem.Services.JackTimeCashOut;

public interface CashOutHttpClientService
{
    Task PostRequest<T>(string actionName, T requestData);
}

public class CashOutHttpClientServiceImp : CashOutHttpClientService
{
    private readonly HttpClient httpClient;
    private readonly LoggingService loggingService;

    public CashOutHttpClientServiceImp(HttpClient httpClient, LoggingService loggingService)
    {
        this.loggingService = loggingService;
        this.httpClient = httpClient;
        this.httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.JackTimeCashOutUrl);
        this.httpClient.DefaultRequestHeaders.Clear();
        this.httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task PostRequest<T>(string actionName, T requestData)
    {
        var response = await httpClient.PostAsJsonAsync(actionName, requestData);
        if (response.IsSuccessStatusCode)
        {
            await loggingService.InfoAsync(await CreateLogResponse(actionName, response));
            return;
        }

        await loggingService.ErrorAsync(await CreateLogResponse(actionName, response));
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