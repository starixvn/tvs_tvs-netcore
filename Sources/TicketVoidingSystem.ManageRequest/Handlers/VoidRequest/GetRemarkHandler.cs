using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class GetRemarkRequest : IRequest<IEnumerable<string>>
{
}

public class GetRemarkHandler : IRequestHandler<GetRemarkRequest, IEnumerable<string>>
{
    private readonly SessionService sessionService;

    public GetRemarkHandler(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    // Jacob, xài yield, gắn else if vào chung, bớt được 1 cái {
    public async Task<IEnumerable<string>> Handle(GetRemarkRequest request, CancellationToken cancellationToken)
    {
        var remarks = new List<string>();
        if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_can_void_Settled_or_Unsettled_tickets);
        }
        else if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host) ||
                 await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_only_void_Unsettled_tickets);
        }
        if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_can_void_Instantly_Settled);
        }

        return await Task.FromResult(remarks);
    }
}