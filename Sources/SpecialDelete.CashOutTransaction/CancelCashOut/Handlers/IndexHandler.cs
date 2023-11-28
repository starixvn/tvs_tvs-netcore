using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using SpecialDelete.CashOutTransaction.CancelCashOut.ViewModels;
using SpecialDelete.CashOutTransaction.Common.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace SpecialDelete.CashOutTransaction.CancelCashOut.Handlers;

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

    public IndexViewModel Handle(Ping message)
    {
        return new IndexViewModel
        {
            UserName = sessionService.UserName,
            Permission = new UserPermission
            {
                SettledTicket = sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelSettledCashOut, Constant.Policy.Host),
                UnSettledTicket = sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelUnSettledCashOut, Constant.Policy.Host)
            }
        };
    }
}