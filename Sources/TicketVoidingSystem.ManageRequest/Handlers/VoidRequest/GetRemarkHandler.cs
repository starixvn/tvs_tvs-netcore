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

    public async Task<IEnumerable<string>> Handle(GetRemarkRequest request, CancellationToken cancellationToken)
    {
        var results = new List<string>();
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host))
        {
            results.Add(StringResource.You_can_void_Settled_or_Unsettled_tickets);
        }
        else
        {
            if (sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host) ||
                sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
            {
                results.Add(StringResource.You_only_void_Unsettled_tickets);
            }
        }

        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
        {
            results.Add(StringResource.You_can_void_Instantly_Settled);
        }

        return await Task.FromResult(results);
    }
}