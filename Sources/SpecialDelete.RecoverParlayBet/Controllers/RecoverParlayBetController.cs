namespace SpecialDelete.RecoverParlayBet.Controllers;

using System.Threading.Tasks;
using Handlers;
using MediatR;

[RouteArea("SportBook")]
[RoutePrefix("RecoverParlayBet")]
[Route("{action}")]
public class RecoverParlayBetController : Controller
{
    private readonly IMediator mediator;

    public RecoverParlayBetController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [NapAuth(FunctionKey = SpecialDeleteFunctionKeys.RecoverParlayBet, Policy = Constant.Policy.Read)]
    public async Task<ActionResult> Index()
    {
        var viewModel = await mediator.Send(new Ping()).ConfigureAwait(false);
        return View(viewModel);
    }
}