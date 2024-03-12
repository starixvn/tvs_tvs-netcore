using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface CheckUsernameService
{
    Task<CheckUsernamesInDatabaseResult> ExecuteValidationInDb(CheckValidUsernamesRequest request);
}

public class CheckUsernameServiceImp : CheckUsernameService
{
    private readonly IDynamicRepository repository;
    private readonly GetTransInfoService getTransInfoService;

    public CheckUsernameServiceImp(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    {
        this.repository = repository;
        this.getTransInfoService = getTransInfoService;
    }

    public async Task<CheckUsernamesInDatabaseResult> ExecuteValidationInDb(CheckValidUsernamesRequest request)
    {
        var transInfoJsonList = await GetTransInfoJson(request);
        var criteria = CreateCriteria(request, transInfoJsonList);
        var mappingTypes = new[] { typeof(CheckUsernamesModel), typeof(TransInfoAddRequestModel), typeof(string), typeof(TicketCalculateWinLostAccount), typeof(AccountWinlostModel) };
        var result = await repository.FetchMultipleAsync(criteria, mappingTypes);
        var checkUsernamesModel = result[0].Cast<CheckUsernamesModel>();
        var transInfoValidation = result[1].Cast<TransInfoAddRequestModel>();
        var transInfoJsonCompress = result[2].Cast<string>();
        var ticketCalculateWinLostAccount = result[3].Cast<TicketCalculateWinLostAccount>();
        var accounts = result[4].Cast<AccountWinlostModel>();

        return new CheckUsernamesInDatabaseResult
        {
            ValidationResult = checkUsernamesModel.FirstOrDefault(),
            TransInfoValidation = transInfoValidation.FirstOrDefault(),
            TransInfoJsonCompress = transInfoJsonCompress.FirstOrDefault(),
            TicketCalculateWinLostAccount = ticketCalculateWinLostAccount,
            AccountWinlost = accounts
        };
    }

    private static CheckValidUsernamesCriteria CreateCriteria(CheckValidUsernamesRequest model, IEnumerable<string> transInfoJsonList)
    {
        var criteria = new CheckValidUsernamesCriteria
        {
            Usernames = model.Usernames,
            RequestId = model.RequestId,
            ActionId = model.ActionId,
            FromDate = model.FromDate,
            ToDate = model.ToDate,
            ProductIds = model.ProductIds,
            StatusIds = model.StatusIds,
            IsVoidAllArchivedTickets = model.IsVoidAllArchivedTickets,
            TransInfoJson = string.Join(",", transInfoJsonList)
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
                Usernames = model.Usernames,
                FromDate = model.FromDate,
                ToDate = model.ToDate,
                ProductIds = model.ProductIds,
                StatusIds = model.StatusIds,
                IsVoidAllArchivedTickets = model.IsVoidAllArchivedTickets
            }
        };
        var transInfoJsonList = await getTransInfoService.GetTransInfoJson(getTransInfoQuery);

        return transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x));
    }
}