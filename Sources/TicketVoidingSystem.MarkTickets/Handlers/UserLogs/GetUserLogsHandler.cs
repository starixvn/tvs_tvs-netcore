using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Handlers.UserLogs;

public class GetUserLogsRequest : GetUserLogsQuery, IRequest<GetUserLogsViewModel>;

public class GetUserLogsHandler(
    UserLogsService userLogsService,
    PagingService pagingService)
    : IRequestHandler<GetUserLogsRequest, GetUserLogsViewModel>
{
    public async Task<GetUserLogsViewModel> Handle(GetUserLogsRequest message, CancellationToken cancellationToken)
    {
        var model = new GetUserLogsViewModel();

        var originalLogs = await userLogsService.GetUserLogs(message);
        model.TotalLogs = originalLogs.Count();

        var pagingLogs = pagingService.Paging(originalLogs, message.PageIndex, message.PageSize);
        model.LogList = await userLogsService.CreateUserLogViewModels(pagingLogs);

        return model;
    }
}