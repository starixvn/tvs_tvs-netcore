using System.Net.Http.Json;
using System.Net.Mime;
using System.Text.Json;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Models;

namespace TicketVoidingSystem.TicketListing.Services.SendDataOic;

public interface AmendmentOicHttpClientService
{
    Task<AmendmentReponse> AmendmentOic(AmendmentOicQuery query);
}

public class AmendmentOicHttpClientServiceImp : AmendmentOicHttpClientService
{
    private readonly HttpClient httpClient;
    private readonly LoggingService loggingService;

    public AmendmentOicHttpClientServiceImp(HttpClient httpClient, LoggingService loggingService)
    {
        this.loggingService = loggingService;
        this.httpClient = httpClient;
        this.httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.AmendmentApi);
        this.httpClient.Timeout = TimeSpan.FromMinutes(5);
        this.httpClient.DefaultRequestHeaders.Clear();
        this.httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task<AmendmentReponse> AmendmentOic(AmendmentOicQuery query)
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var response = await httpClient.PostAsJsonAsync("api/Amendment", query, options);
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadFromJsonAsync<AmendmentReponse>(options);
        }

        await loggingService.ErrorAsync($"URL: {AppSettingService.AppSetting.AmendmentApi}api/Amendment{Environment.NewLine}Response:{Environment.NewLine}{response}");
        return new AmendmentReponse { Code = (int)response.StatusCode, Message = response.ReasonPhrase };
    }
}