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
        var results = new List<string>();
        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host))
        {
            results.Add(StringResource.You_can_void_Settled_or_Unsettled_tickets);
        }
        else
        {
            if (sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host) ||
                sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledandInstantlySettledSingleBet, Constant.Policy.Host))
            {
                results.Add(StringResource.You_only_void_Unsettled_tickets);
            }
        }

        if (sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledandInstantlySettledSingleBet, Constant.Policy.Host))
        {
            results.Add(StringResource.You_can_void_Instantly_Settled);
        }

        return Task.FromResult(results);
    }
}