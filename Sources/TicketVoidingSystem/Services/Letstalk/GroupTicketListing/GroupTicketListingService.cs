using System.Threading.Tasks;
using Fanex.LetstalkService.Client.Models;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk.GroupTicketListing;

public interface GroupTicketListingService
{
    Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment);
}

public class GroupTicketListingServiceImp(LetstalkSingleMessageService letstalkSingleMessageService)
    : GroupTicketListingService
{
    public async Task<Result> SendMessage(LetstalkModel letstalkModel, LetstalkAttachment attachment)
    {
        return await letstalkSingleMessageService.Send(letstalkModel, attachment);
    }
}