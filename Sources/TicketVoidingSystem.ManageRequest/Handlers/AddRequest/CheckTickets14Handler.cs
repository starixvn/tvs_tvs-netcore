using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Services.OnlineServerRepository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckTickets14Request : CheckTickets14Model, IRequest<CheckTickets14ViewModel>;

public class CheckTickets14Handler(OnlineServerRepository onlineServerRepository)
    : IRequestHandler<CheckTickets14Request, CheckTickets14ViewModel>
{
    public async Task<CheckTickets14ViewModel> Handle(CheckTickets14Request request, CancellationToken cancellationToken)
    {
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();
        var criteria = new CheckTickets14Criteria
        {
            TransIds = request.TransIds,
            IsVoidAllArchivedTickets = request.IsVoidAllArchivedTickets,
            TransInfoJson = currentOnlineServerId
        };

        var results = await onlineServerRepository.FetchAsync<CheckTickets14ViewModel>(criteria);
        return new CheckTickets14ViewModel
        {
            InvalidTransIds = Helper.GetIntersectTransIdString(results.Select(x => x.InvalidTransIds)),
            UnsupportedDateRangeTransIds = Helper.GetUnionTransIdString(results.Select(x => x.UnsupportedDateRangeTransIds)),
            TransInfoJson = string.Join(",", results.Where(x => !string.IsNullOrWhiteSpace(x.TransInfoJson)).Select(x => x.TransInfoJson))
        };
    }
}