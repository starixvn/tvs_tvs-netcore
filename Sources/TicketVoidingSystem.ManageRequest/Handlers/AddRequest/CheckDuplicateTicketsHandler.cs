using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckDuplicateTicketsRequest : CheckDuplicateTicketsCriteria, IRequest<CheckDuplicateTicketsViewModel>
{
    public int IssueTypeId { get; set; }
}

public class CheckDuplicateTicketsHandler : IRequestHandler<CheckDuplicateTicketsRequest, CheckDuplicateTicketsViewModel>
{
    private readonly IDynamicRepository repository;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly GetTransInfoService getTransInfoService;

    public CheckDuplicateTicketsHandler(IDynamicRepository repository, MatchInfoAddRequestService matchInfoAddRequestService, GetTransInfoService getTransInfoService)
    {
        this.repository = repository;
        this.matchInfoAddRequestService = matchInfoAddRequestService;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<CheckDuplicateTicketsViewModel> Handle(CheckDuplicateTicketsRequest request, CancellationToken cancellationToken)
    {
        var criteria = await GetCheckDuplicateTicketsCriteria(request);
        var mappingTypes = new[] { typeof(MatchInfoAddRequest), typeof(ValidationDuplicateTickets), typeof(TransInfoAddRequestModel), typeof(string) };
        var result = await repository.FetchMultipleAsync(criteria, mappingTypes, cancellationToken);
        var match = result[0].Cast<MatchInfoAddRequest>().FirstOrDefault();
        var validation = result[1].Cast<ValidationDuplicateTickets>().FirstOrDefault();
        var transInfoAddRequestModel = result[2].Cast<TransInfoAddRequestModel>().FirstOrDefault();
        var transInfoJson = result[3].Cast<string>().FirstOrDefault();

        var viewModel = new CheckDuplicateTicketsViewModel
        {
            Match = matchInfoAddRequestService.UpdateDataFromRemotingRef(match),
            Validation = validation,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequestModel?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequestModel?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequestModel?.MarkTransIds,
                TransInfoJson = transInfoJson
            }
        };

        return viewModel;
    }

    private async Task<CheckDuplicateTicketsCriteria> GetCheckDuplicateTicketsCriteria(CheckDuplicateTicketsRequest message)
    {
        var transInfoJsonList = await GetTransInfoJson(message);
        var criteria = new CheckDuplicateTicketsCriteria
        {
            TransIds = message.TransIds,
            RequestId = message.RequestId,
            ActionId = message.ActionId,
            FilterBy = message.FilterBy,
            SubIssueTypeId = message.SubIssueTypeId,
            TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)))
        };

        return criteria;
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckDuplicateTicketsRequest model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = model.IssueTypeId,
            TransIds = model.TransIds
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}