using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckTickets14Request : CheckTickets14Model, IRequest<CheckTickets14ViewModel>;

public class CheckTickets14Handler(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    : IRequestHandler<CheckTickets14Request, CheckTickets14ViewModel>
{
    public async Task<CheckTickets14ViewModel> Handle(CheckTickets14Request request, CancellationToken cancellationToken)
    {
        var transInfoJsonList = await GetTransInfoJson(request);
        var criteria = new CheckTickets14Criteria
        {
            TransIds = request.TransIds,
            IsVoidAllArchivedTickets = request.IsVoidAllArchivedTickets,
            TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)))
        };

        return await repository.GetAsync<CheckTickets14ViewModel>(criteria);
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckTickets14Model model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = IssueTypeConstant.ArchivedTicket,
            TransIds = model.TransIds
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}