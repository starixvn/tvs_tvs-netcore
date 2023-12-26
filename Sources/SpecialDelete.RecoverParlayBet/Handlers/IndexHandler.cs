using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using SpecialDelete.RecoverParlayBet.ViewModels;
using TicketVoidingSystem.Web;

namespace SpecialDelete.RecoverParlayBet.Handlers;

public class Ping : IRequest<IndexViewModel>
{
}

public class IndexHandler : IRequestHandler<Ping, IndexViewModel>
{
    private readonly ISessionService sessionService;

    public IndexHandler(ISessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    public IndexViewModel Handle(Ping message)
    {
        return new IndexViewModel
        {
            HasMainPermission = sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverMainParlayBet, Constant.Policy.Read),
            HasSubPermission = sessionService.HasPermission(SpecialDeleteFunctionKeys.RecoverSubParlayBet, Constant.Policy.Read)
        };
    }
}