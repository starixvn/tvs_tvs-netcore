using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.VoidByBetId.Handlers;

public class Ping : IRequest<IndexViewModel>
{
}

public class IndexHandler : IRequestHandler<Ping, IndexViewModel>
{
    private readonly SessionService sessionService;

    public IndexHandler(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    public async Task<IndexViewModel> Handle(Ping request, CancellationToken cancellationToken)
    {
        return new IndexViewModel
        {
            UserName = sessionService.UserName,
            Permission = new UserPermission
            {
                SettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host),
                UnSettledTicket = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host)
            }
        };
    }
}