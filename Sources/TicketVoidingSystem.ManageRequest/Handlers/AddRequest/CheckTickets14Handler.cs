using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckTickets14Request : CheckTickets14Model, IRequest<CheckTickets14ViewModel>
{
}

public class CheckTickets14Handler : IRequestHandler<CheckTickets14Request, CheckTickets14ViewModel>
{
    private readonly IDynamicRepository repository;
    private readonly GetTransInfoService getTransInfoService;

    public CheckTickets14Handler(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    {
        this.repository = repository;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<CheckTickets14ViewModel> Handle(CheckTickets14Request request, CancellationToken cancellationToken)
    {
        var transInfoJsonList = await GetTransInfoJson(request);
        var criteria = new CheckTickets14Criteria
        {
            TransIds = request.TransIds,
            TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)))
        };

        var (firstResultSet, secondResultSet) =
            await repository.FetchMultipleAsync<CheckTickets14ViewModel, string>(criteria, cancellationToken);

        return new CheckTickets14ViewModel
        {
            InvalidTransIds = firstResultSet.FirstOrDefault()?.InvalidTransIds,
            UnsupportedDateRangeTransIds = firstResultSet.FirstOrDefault()?.UnsupportedDateRangeTransIds,
            TransInfoJson = secondResultSet.FirstOrDefault()
        };
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