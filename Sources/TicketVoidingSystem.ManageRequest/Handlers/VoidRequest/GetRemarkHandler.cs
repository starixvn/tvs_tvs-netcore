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
        var remarks = new List<string>();
        AddRemarkForPermissionSettled(remarks);
        AddRemarkForPermissionInstant(remarks);

        return await Task.FromResult(remarks);
    }

    private void AddRemarkForPermissionSettled(ICollection<string> remarks)
    {
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_can_void_Settled_or_Unsettled_tickets);
        }
        else
        {
            AddRemarkForPermissionUnsettled(remarks);
        }
    }

    private void AddRemarkForPermissionUnsettled(ICollection<string> remarks)
    {
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host) ||
            sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_only_void_Unsettled_tickets);
        }
    }

    private void AddRemarkForPermissionInstant(ICollection<string> remarks)
    {
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_can_void_Instantly_Settled);
        }
    }
}