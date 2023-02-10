using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.Services.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.MarkTickets.Handlers.UserLogs;

public class GetUserLogsRequest : GetUserLogsQuery, IRequest<GetUserLogsViewModel>
{
}

public class GetUserLogsHandler : IRequestHandler<GetUserLogsRequest, GetUserLogsViewModel>
{
    private readonly UserLogsService userLogsService;
    private readonly PagingService pagingService;

    public GetUserLogsHandler(
        UserLogsService userLogsService,
        PagingService pagingService)
    {
        this.userLogsService = userLogsService;
        this.pagingService = pagingService;
    }

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