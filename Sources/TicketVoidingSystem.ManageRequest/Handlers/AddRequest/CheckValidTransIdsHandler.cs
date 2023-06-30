using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckValidTransIdsRequest : CheckValidTransIdsModel, IRequest<CheckValidTransIdsViewModel>
{
}

public class CheckValidTransIdsHandler : IRequestHandler<CheckValidTransIdsRequest, CheckValidTransIdsViewModel>
{
    private readonly IDynamicRepository repository;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly GetTransInfoService getTransInfoService;

    public CheckValidTransIdsHandler(IDynamicRepository repository, MatchInfoAddRequestService matchInfoAddRequestService, GetTransInfoService getTransInfoService)
    {
        this.repository = repository;
        this.matchInfoAddRequestService = matchInfoAddRequestService;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<CheckValidTransIdsViewModel> Handle(CheckValidTransIdsRequest request, CancellationToken cancellationToken)
    {
        var criteria = await GetCheckValidTransIdsCriteria(request);
        var mappingTypes = new[] { typeof(MatchInfoAddRequest), typeof(ValidationAbnormalBet), typeof(TransInfoAddRequestModel), typeof(string) };
        var result = await repository.FetchMultipleAsync(criteria, mappingTypes, cancellationToken);
        var match = result[0].Cast<MatchInfoAddRequest>().FirstOrDefault();
        var validation = result[1].Cast<ValidationAbnormalBet>().FirstOrDefault();
        var transInfoAddRequestModel = result[2].Cast<TransInfoAddRequestModel>().FirstOrDefault();
        var transInfoJson = result[3].Cast<string>().FirstOrDefault();

        var viewModel = new CheckValidTransIdsViewModel
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

    private async Task<CheckValidTransIdsCriteria> GetCheckValidTransIdsCriteria(CheckValidTransIdsRequest message)
    {
        var transInfoJsonList = await GetTransInfoJson(message);
        var criteria = new CheckValidTransIdsCriteria
        {
            TransIds = message.TransIds,
            RequestId = message.RequestId,
            ActionId = message.ActionId,
            FilterBy = message.FilterBy,
            SubIssueTypeId = message.SubIssueTypeId,
            IsRemoveCustomerClass201 = message.IsRemoveCustomerClass201,
            IsRemoveCustomerClass4K = message.IsRemoveCustomerClass4K,
            TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)))
        };

        return criteria;
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckValidTransIdsModel model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = model.IssueTypeId,
            TransIds = model.TransIds
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}