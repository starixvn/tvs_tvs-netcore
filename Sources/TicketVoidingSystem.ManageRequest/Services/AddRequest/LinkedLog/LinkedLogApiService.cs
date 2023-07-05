using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;

public interface LinkedLogApiService
{
    Task<IEnumerable<PoolHouseLinkedLogResponse>> GetLinkedLog(GetLinkedLogModel getLinkedLogModel);
}

public class LinkedLogApiServiceImp : LinkedLogApiService
{
    private readonly LinkedLogHttpClientService linkedLogHttpClientService;

    public LinkedLogApiServiceImp(LinkedLogHttpClientService linkedLogHttpClientService)
    {
        this.linkedLogHttpClientService = linkedLogHttpClientService;
    }

    public async Task<IEnumerable<PoolHouseLinkedLogResponse>> GetLinkedLog(GetLinkedLogModel getLinkedLogModel)
    {
        var responseData = await linkedLogHttpClientService.PostHttpRequest(new PoolHouseLinkedLogRequest
        {
            MatchId = getLinkedLogModel.MatchId,
            LiveIndicator = getLinkedLogModel.LiveIndicator
        });

        var poolHouseLinkedLogResponses = await responseData.Content.ReadAsAsync<IEnumerable<PoolHouseLinkedLogResponse>>();

        return poolHouseLinkedLogResponses;
    }
}