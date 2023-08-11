using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckValidUsernamesRequest : CheckValidUsernamesCriteria, IRequest<CheckValidUsernamesViewModel>
{
}

public class CheckValidUsernamesHandler : IRequestHandler<CheckValidUsernamesRequest, CheckValidUsernamesViewModel>
{
    private readonly IDynamicRepository repository;
    private readonly GetTransInfoService getTransInfoService;

    public CheckValidUsernamesHandler(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    {
        this.repository = repository;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<CheckValidUsernamesViewModel> Handle(CheckValidUsernamesRequest request, CancellationToken cancellationToken)
    {
        var criteria = await CreateCriteria(request);
        var (validation, transInfoAddRequest, transInfoJson) = await repository
            .FetchMultipleAsync<CheckUsernamesModel, TransInfoAddRequestModel, string>(criteria, cancellationToken);
        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = validation.FirstOrDefault() ?? new CheckUsernamesModel(),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequest.FirstOrDefault()?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequest.FirstOrDefault()?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequest.FirstOrDefault()?.MarkTransIds,
                TransInfoJson = transInfoJson.FirstOrDefault()
            }
        };

        return viewModel;
    }

    private async Task<CheckValidUsernamesCriteria> CreateCriteria(CheckValidUsernamesRequest model)
    {
        var transInfoJsonList = await GetTransInfoJson(model);
        var criteria = new CheckValidUsernamesCriteria
        {
            RequestId = model.RequestId,
            ActionId = model.ActionId,
            Usernames = model.Usernames,
            FromDate = model.FromDate,
            ToDate = model.ToDate,
            ProductIds = model.ProductIds,
            StatusIds = model.StatusIds,
            TransInfoJson = string.Join(",", transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x)))
        };

        return criteria;
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(CheckValidUsernamesRequest model)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = IssueTypeConstant.AbnormalAccount,
            Usernames = model.Usernames,
            FromDate = model.FromDate,
            ToDate = model.ToDate,
            ProductIds = model.ProductIds,
            StatusIds = model.StatusIds
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}