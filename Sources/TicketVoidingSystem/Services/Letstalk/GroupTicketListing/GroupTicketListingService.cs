using System.Threading.Tasks;
using Fanex.LetstalkService.Core.Models;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk.GroupTicketListing;

public interface GroupTicketListingService
{
    Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment);
}

public class GroupTicketListingServiceImp : GroupTicketListingService
{
    private readonly LetstalkSingleMessageService letstalkSingleMessageService;

    public GroupTicketListingServiceImp(LetstalkSingleMessageService letstalkSingleMessageService)
    {
        this.letstalkSingleMessageService = letstalkSingleMessageService;
    }

    public async Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment)
    {
        return await letstalkSingleMessageService.Send(letstalkModel, attachment);
    }
}