namespace TicketVoidingSystem.MarkTickets.Handlers
{
    using System.Threading.Tasks;
    using MediatR;

    public class GetUserLogsRequest : GetUserLogsQuery, IRequest<GetUserLogsViewModel>
    {
    }

    public class GetUserLogsHandler : IAsyncRequestHandler<GetUserLogsRequest, GetUserLogsViewModel>
    {
        private readonly UserLogsService userLogsService;
        private readonly IPagingService paggingService;

        public GetUserLogsHandler(
            UserLogsService userLogsService,
            IPagingService paggingService)
        {
            this.userLogsService = userLogsService;
            this.paggingService = paggingService;
        }

        public async Task<GetUserLogsViewModel> Handle(GetUserLogsRequest message)
        {
            var model = new GetUserLogsViewModel();

            var originalLogs = await userLogsService.GetUserLogs(message);
            model.TotalLogs = originalLogs.Count;

            var paggingLogs = paggingService.Paging(originalLogs, message.PageIndex, message.PageSize);
            model.LogList = await userLogsService.CreateUserLogViewModels(paggingLogs);

            return model;
        }
    }
}