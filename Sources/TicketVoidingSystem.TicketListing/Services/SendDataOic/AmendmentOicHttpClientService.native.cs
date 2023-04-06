using System.Net.Mime;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.Utilities;

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
        var response = await httpClient.PostAsync("api/Amendment", Helper.CreateRequestStringContent(query));
        if (response.IsSuccessStatusCode)
        {
            return await Helper.DeserializeResponseStream<AmendmentReponse>(response);
        }

        await loggingService.ErrorAsync($"URL: {AppSettingService.AppSetting.AmendmentApi}api/Amendment{Environment.NewLine}Response:{Environment.NewLine}{response}");
        return new AmendmentReponse { Code = (int)response.StatusCode, Message = response.ReasonPhrase };
    }
}