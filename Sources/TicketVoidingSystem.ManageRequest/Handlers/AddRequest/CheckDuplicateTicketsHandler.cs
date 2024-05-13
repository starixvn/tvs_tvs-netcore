using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckDuplicateTicketsRequest : IRequest<CheckDuplicateTicketsViewModel>
{
    public int IssueTypeId { get; set; }

    public string TransIds { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public int? FilterBy { get; set; }

    public int SubIssueTypeId { get; set; }
}

public class CheckDuplicateTicketsHandler : IRequestHandler<CheckDuplicateTicketsRequest, CheckDuplicateTicketsViewModel>
{
    private readonly IDynamicRepository repository;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;

    public CheckDuplicateTicketsHandler(IDynamicRepository repository, MatchInfoAddRequestService matchInfoAddRequestService)
    {
        this.repository = repository;
        this.matchInfoAddRequestService = matchInfoAddRequestService;
    }

    public async Task<CheckDuplicateTicketsViewModel> Handle(CheckDuplicateTicketsRequest request, CancellationToken cancellationToken)
    {
        var criteria = await GetCheckDuplicateTicketsCriteria(request);

        var (match, validation, transInfoAddRequestModel, _) =
            await repository.FetchMultipleAsync<MatchInfoAddRequest, ValidationDuplicateTickets, TransInfoAddRequestModel, string>(criteria);

        var viewModel = new CheckDuplicateTicketsViewModel
        {
            Match = matchInfoAddRequestService.UpdateDataFromRemotingRef(match.FirstOrDefault()),
            Validation = validation.FirstOrDefault(),
            TransInfoAddRequestModel = transInfoAddRequestModel.FirstOrDefault()
        };

        return viewModel;
    }

    private async Task<CheckDuplicateTicketsCriteria> GetCheckDuplicateTicketsCriteria(CheckDuplicateTicketsRequest model)
    {
        var criteria = new CheckDuplicateTicketsCriteria
        {
            TransIds = model.TransIds,
            RequestId = model.RequestId,
            ActionId = model.ActionId,
            FilterBy = model.FilterBy,
            SubIssueTypeId = model.SubIssueTypeId,
            TransInfoJson = await GetTransInfoJson(model)
        };

        return criteria;
    }

    private async Task<string> GetTransInfoJson(CheckDuplicateTicketsRequest model)
    {
        var criteria = new GetTransInfoDuplicateTicketsCriteria
        {
            TransIds = model.TransIds
        };

        return await repository.GetAsync<string>(criteria);
    }
}