using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Mime;
using System.Text.Json;
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
        try
        {
            var response = await httpClient.PostAsJsonAsync(actionName, requestData);
            if (response.IsSuccessStatusCode)
            {
                await loggingService.InfoAsync(await CreateLogResponse(actionName, response, requestData));
                return;
            }

            await loggingService.ErrorAsync(await CreateLogResponse(actionName, response, requestData));
        }
        catch (Exception exception)
        {
            var responseContent = await CreateLogResponse(actionName, null, requestData);
            await loggingService.ErrorAsync($"{responseContent}{Environment.NewLine}Exception:{Environment.NewLine}{exception}");
        }
    }

    private static async Task<string> CreateLogResponse<T>(string actionName, HttpResponseMessage response, T requestData)
    {
        return $"{AppSettingService.AppSetting.JackTimeCashOutUrl}{actionName}" +
               $"{Environment.NewLine}RequestContent:{Environment.NewLine}{JsonSerializer.Serialize(requestData)}" +
               $"{Environment.NewLine}ResponseContent:{Environment.NewLine}{await CreateResponseStringContent(response)}" +
               $"{Environment.NewLine}Response:{Environment.NewLine}{response}";
    }

    private static async Task<string> CreateResponseStringContent(HttpResponseMessage response)
    {
        if (response == null)
        {
            return "";
        }

        return await response.Content.ReadAsStringAsync(); ;
    }
}