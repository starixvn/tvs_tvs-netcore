namespace SpecialDelete.RecoverParlayBet.Controllers;

using System.Threading.Tasks;
using System.Web.Mvc;
using Core.Extensions;
using Core.Web;
using Fanex.NAP.Core.Business;
using Fanex.NAP.Core.Web.Attribute;
using Handlers;
using MediatR;

[RouteArea("SportBook")]
[RoutePrefix("RecoverSubParlay")]
[Route("{action}")]
public class RecoverSubParlayController : Controller
{
    private readonly IMediator mediator;

    public RecoverSubParlayController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSubParlayBet, Policy = Constant.Policy.Read)]
    [HttpPost]
    public async Task<JsonResult> GetTickets(GetSubTicketsRequest request)
    {
        var model = await mediator.Send(request).ConfigureAwait(false);
        return this.LargeJson(model);
    }

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverSubParlayBet, Policy = Constant.Policy.Host)]
    [HttpPost]
    public async Task<JsonResult> Recover(RecoverSubTicketsRequest request)
    {
        var model = await mediator.Send(request).ConfigureAwait(false);
        return this.LargeJson(model);
    }
}