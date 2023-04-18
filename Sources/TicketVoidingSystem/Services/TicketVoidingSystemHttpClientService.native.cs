using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Mime;
using System.Threading.Tasks;
using Fanex.Logging;
using Microsoft.Extensions.Configuration;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services;

public interface TicketVoidingSystemHttpClientService
{
    Task SignalRUpdateRequestStatusToAllUsers(IEnumerable<RequestStatus> status);
}

public class TicketVoidingSystemHttpClientServiceImp : TicketVoidingSystemHttpClientService
{
    private readonly HttpClient httpClient;

    public TicketVoidingSystemHttpClientServiceImp(HttpClient client, IConfiguration configuration)
    {
        httpClient = client;
        httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.TicketVoidingSystemUrl);
        httpClient.Timeout = TimeSpan.FromMinutes(5);
        httpClient.DefaultRequestHeaders.Clear();
        httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task SignalRUpdateRequestStatusToAllUsers(IEnumerable<RequestStatus> status)
    {
        const string actionName = "SignalRApi/UpdateRequestStatusToAllUsers";
        using var response = await httpClient.PostAsync(actionName, Helper.CreateRequestStringContent(new { status }));
        if (response.IsSuccessStatusCode)
        {
            return;
        }

        await LogService.ErrorAsync($"{AppSettingService.AppSetting.TicketVoidingSystemUrl}{actionName}" +
                                    $"{Environment.NewLine}Response:{Environment.NewLine}{response}");
    }
}