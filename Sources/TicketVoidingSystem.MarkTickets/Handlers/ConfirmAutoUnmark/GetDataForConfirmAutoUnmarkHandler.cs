using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark;

public class GetDataForConfirmAutoUnmarkRequest : GetDataForConfirmAutoUnmarkQuery, IRequest<GetDataForConfirmAutoUnmarkViewModel>
{
}

public class GetDataForConfirmAutoUnmarkHandler(
    ConfirmAutoUnmarkService confirmAutoUnmarkService,
    PagingService pagingService,
    MapDataForConfirmAutoUnmarkService mapDataForConfirmAutoUnmarkService)
    : IRequestHandler<GetDataForConfirmAutoUnmarkRequest, GetDataForConfirmAutoUnmarkViewModel>
{
    public async Task<GetDataForConfirmAutoUnmarkViewModel> Handle(GetDataForConfirmAutoUnmarkRequest message, CancellationToken cancellationToken)
    {
        var model = new GetDataForConfirmAutoUnmarkViewModel();
        var data = await confirmAutoUnmarkService.GetDataForConfirmAutoUnmark(message);
        model.TotalItems = data.Count();

        var dataPaging = pagingService.Paging(data, message.PageIndex, message.PageSize);
        model.Items = mapDataForConfirmAutoUnmarkService.MapToConfirmAutoUnmarkViewModels(dataPaging);

        return model;
    }
}