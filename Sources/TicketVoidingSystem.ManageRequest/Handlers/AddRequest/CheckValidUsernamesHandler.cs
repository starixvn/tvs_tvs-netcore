using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class CheckValidUsernamesRequest : IRequest<CheckValidUsernamesViewModel>
{
    public IEnumerable<AccountWinlostModel> AccountWinlostModels { get; set; }

    public int? RequestId { get; set; }

    public int ActionId { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string ProductIds { get; set; }

    public string StatusIds { get; set; }
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
        var mappingTypes = new[] { typeof(CheckUsernamesModel), typeof(TransInfoAddRequestModel), typeof(string), typeof(TicketCalculateWinLostAccount), typeof(AccountWinlostModel) };
        var result = await repository.FetchMultipleAsync(criteria, mappingTypes, cancellationToken);
        var checkUsernamesModel = result[0].Cast<CheckUsernamesModel>();
        var transInfoAddRequestModel = result[1].Cast<TransInfoAddRequestModel>().FirstOrDefault();
        var transInfoJson = result[2].Cast<string>();
        //var ticketCalculateWinLostAccount = result[3].Cast<TicketCalculateWinLostAccount>();
        //var accountWinlostModel = result[4].Cast<AccountWinlostModel>();

        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = checkUsernamesModel.FirstOrDefault() ?? new CheckUsernamesModel(),
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = transInfoAddRequestModel?.RemoveTransIds,
                UnMarkTransIds = transInfoAddRequestModel?.UnMarkTransIds,
                MarkTransIds = transInfoAddRequestModel?.MarkTransIds,
                TransInfoJson = transInfoJson.FirstOrDefault()
            },
            AccountWinlostModels = GetAccountWinlostModels()
        };

        return viewModel;
    }

    private IEnumerable<AccountWinlostModel> GetAccountWinlostModels()
    {
        return new List<AccountWinlostModel>
        {
            new()
            {
                Username = "AAA", CustId = 1, GivenCredit = 200, AdjustVoidLimit = null, CurrentWinning = 100, CurrentLosing = 50,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "BBB", CustId = 2, GivenCredit = 100, AdjustVoidLimit = null, CurrentWinning = 100, CurrentLosing = 300,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "CCC", CustId = 3, GivenCredit = 500, AdjustVoidLimit = null, CurrentWinning = 100, CurrentLosing = 50,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "DD", CustId = 4, GivenCredit = 350, AdjustVoidLimit = null, CurrentWinning = 100, CurrentLosing = 400,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            },
            new()
            {
                Username = "EE", CustId = 5, GivenCredit = 400, AdjustVoidLimit = null, CurrentWinning = 100, CurrentLosing = 300,
                EstimateVoidAmount = 20, WinLostAfterVoid = 10
            }
        };
    }

    private async Task<CheckValidUsernamesCriteria> CreateCriteria(CheckValidUsernamesRequest model)
    {
        var transInfoJsonList = await GetTransInfoJson(model);
        var criteria = new CheckValidUsernamesCriteria
        {
            RequestId = model.RequestId,
            ActionId = model.ActionId,
            Usernames = string.Join(",", model.AccountWinlostModels.Select(x => x.Username)),
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
            AbnormalAccountViewModel = new AbnormalAccountViewModel
            {
                AccountWinlostModels = model.AccountWinlostModels,
                FromDate = model.FromDate,
                ToDate = model.ToDate,
                ProductIds = model.ProductIds,
                StatusIds = model.StatusIds
            }
        };

        return await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
    }
}