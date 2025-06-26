using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByBetId.Handlers;

public class GetRemarkRequest : IRequest<IEnumerable<string>>;

public class GetRemarkHandler(SessionService sessionService) : IRequestHandler<GetRemarkRequest, IEnumerable<string>>
{
    public async Task<IEnumerable<string>> Handle(GetRemarkRequest request, CancellationToken cancellationToken)
    {
        return await Task.FromResult(GetRemarksForPermission().ToBlockingEnumerable(cancellationToken));
    }

    private async IAsyncEnumerable<string> GetRemarksForPermission()
    {
        if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host))
        {
            yield return StringResource.Warning_Message_VoidBetId;
        }
        else if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host))
        {
            yield return StringResource.Warning_Message_VoidBetId_UnSettled;
        }
    }
}