using MediatR;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

using Fanex.NAP.Client.Helpers.Business;

public class GetRemarkRequest : IRequest<IEnumerable<string>>;

public class GetRemarkHandler(SessionService sessionService) : IRequestHandler<GetRemarkRequest, IEnumerable<string>>
{
    public async Task<IEnumerable<string>> Handle(GetRemarkRequest request, CancellationToken cancellationToken)
    {
        return await Task.FromResult(GetRemarksForPermission().ToBlockingEnumerable(cancellationToken));
    }

    private async IAsyncEnumerable<string> GetRemarksForPermission()
    {
        if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host))
        {
            yield return StringResource.You_can_void_Settled_or_Unsettled_tickets;
        }
        else
        {
            if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host) ||
                await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
            {
                yield return StringResource.You_only_void_Unsettled_tickets;
            }
        }
        if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
        {
            yield return StringResource.You_can_void_Instantly_Settled;
        }
    }
}