using System;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.NetPosition;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.NetPosition;

public interface NetPositionHttpClientService
{
    Task<Result> PostRequest(string transIdCrickets, string actionType);
}

public class NetPositionHttpClientServiceImp : NetPositionHttpClientService
{
    // Jacob: Sao phai truyền vào httpClient? Sao không new luôn. A ko nhớ đã đọc ở đâu, không được tạo nhiều httpclient
    // Đọc phần recommended use ở đây: https://learn.microsoft.com/en-us/dotnet/fundamentals/networking/http/httpclient-guidelines
    //
    private readonly HttpClient httpClient;
    private readonly LoggingService loggingService;

    public NetPositionHttpClientServiceImp(HttpClient client, LoggingService loggingService)
    {
        this.loggingService = loggingService;
        httpClient = client;
        httpClient.BaseAddress = new Uri(AppSettingService.AppSetting.NetPositionUrl);
        httpClient.Timeout = TimeSpan.FromMinutes(5);
        httpClient.DefaultRequestHeaders.Clear();
        httpClient.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
    }

    public async Task<Result> PostRequest(string transIdCrickets, string actionType)
    {
        try
        {
            var requestModel = new NetPositionRequestModel
            {
                Action = actionType,
                TransId = transIdCrickets.Split(',').Select(long.Parse).ToArray()
            };
            const string actionName = "void";
            var response = await httpClient.PostAsync(actionName, Helper.CreateRequestStringContent(requestModel));
            var result = await Helper.DeserializeResponseStream<Result>(response);

            if (!response.IsSuccessStatusCode)
            {
                await loggingService.ErrorAsync($"{AppSettingService.AppSetting.NetPositionUrl}{actionName}" +
                                                $"{Environment.NewLine}Response:{Environment.NewLine}{response}");
            }

            return result;
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception.Message, exception);

            return new Result { ErrorCode = ErrorCode.Default, ErrorMsg = exception.Message };
        }
    }
}