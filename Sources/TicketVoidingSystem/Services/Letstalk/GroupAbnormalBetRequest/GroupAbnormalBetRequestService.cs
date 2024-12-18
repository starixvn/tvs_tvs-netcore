using System.Threading.Tasks;
using Fanex.LetstalkService.Client.Models;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk.GroupAbnormalBetRequest;

public interface GroupAbnormalBetRequestService
{
    Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment);
}

public class GroupAbnormalBetRequestServiceImp(LetstalkSingleMessageService letstalkSingleMessageService)
    : GroupAbnormalBetRequestService
{
    public async Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment)
    {
        return await letstalkSingleMessageService.Send(letstalkModel, attachment);
    }
}