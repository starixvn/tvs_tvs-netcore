using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class GetRemarkRequest : IRequest<List<string>>
{
}

public class GetRemarkHandler : IRequestHandler<GetRemarkRequest, List<string>>
{
    private readonly SessionService sessionService;

    public GetRemarkHandler(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    public Task<List<string>> Handle(GetRemarkRequest request, CancellationToken cancellationToken)
    {
        var remarks = new List<string>();
        AddRemarkForPermissionSettled(remarks);
        AddRemarkForPermissionInstant(remarks);

        return Task.FromResult(remarks);
    }

    private void AddRemarkForPermissionSettled(ICollection<string> remarks)
    {
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host))
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
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host) ||
            sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_only_void_Unsettled_tickets);
        }
    }

    private void AddRemarkForPermissionInstant(ICollection<string> remarks)
    {
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host))
        {
            remarks.Add(StringResource.You_can_void_Instantly_Settled);
        }
    }
}