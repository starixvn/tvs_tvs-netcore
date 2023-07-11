using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk.GroupAbnormalBetRequest;

public interface GroupAbnormalBetRequestService
{
    Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment);
}

public class GroupAbnormalBetRequestServiceImp : GroupAbnormalBetRequestService
{
    private readonly LetstalkSingleMessageService letstalkSingleMessageService;

    public GroupAbnormalBetRequestServiceImp(LetstalkSingleMessageService letstalkSingleMessageService)
    {
        this.letstalkSingleMessageService = letstalkSingleMessageService;
    }

    public async Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment)
    {
        return await letstalkSingleMessageService.Send(letstalkModel, attachment);
    }
}