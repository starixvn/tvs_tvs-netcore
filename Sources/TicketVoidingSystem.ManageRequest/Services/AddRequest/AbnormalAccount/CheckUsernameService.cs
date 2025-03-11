using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using ResultTicket = (System.Collections.Generic.IEnumerable<TicketVoidingSystem.ManageRequest.ViewModels.CheckUsernamesModel> ValidationResult
    , System.Collections.Generic.IEnumerable<TicketVoidingSystem.ManageRequest.Models.TicketCalculateWinLostAccount> TicketCalculateWinLostAccount,
    System.Collections.Generic.IEnumerable<TicketVoidingSystem.ManageRequest.Models.AccountWinlostModel> AccountWinlostModel);

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface CheckUsernameService
{
    Task<CheckUsernamesInDatabaseResult> ExecuteValidationInDb(CheckValidUsernamesRequest request);
}

public class CheckUsernameServiceImp(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    : CheckUsernameService
{
    public async Task<CheckUsernamesInDatabaseResult> ExecuteValidationInDb(CheckValidUsernamesRequest request)
    {
        //var transInfoJsonList = await GetTransInfoJson(request);
        //if (IsTransInfoJsonTooLarge(transInfoJsonList))
        //{
        //    return new CheckUsernamesInDatabaseResult
        //    {
        //        ValidationResult = new CheckUsernamesModel { IsTicketLimitExceeded = true }
        //    };
        //}

        var criteria = CreateCriteria(request, transInfoJsonList);
        var (checkUsernamesModel, transInfoValidation, transInfoJsonCompress, ticketCalculateWinLostAccount, accounts) =
            await repository.FetchMultipleAsync<CheckUsernamesModel, TransInfoAddRequestModel, string, TicketCalculateWinLostAccount, AccountWinlostModel>(criteria);

        return new CheckUsernamesInDatabaseResult
        {
            ValidationResult = checkUsernamesModel.FirstOrDefault(),
            TransInfoValidation = transInfoValidation.FirstOrDefault(),
            TransInfoJsonCompress = transInfoJsonCompress.FirstOrDefault(),
            TicketCalculateWinLostAccount = ticketCalculateWinLostAccount,
            AccountWinlost = accounts
        };
    }

    private async Task<ResultTicket> ValidateUsernamesBySite(CheckValidUsernamesRequest request)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var criteria = CreateGetTicketSiteDbCriteria(server.Id);
            return repository.FetchMultipleAsync<CheckUsernamesModel, TicketCalculateWinLostAccount, AccountWinlostModel>(criteria);
        });

        var results = await Task.WhenAll(tasks);

        var validationResults = results.SelectMany(x => x.Item1);
        var ticketsResults = results.SelectMany(x => x.Item2);
        var accountResults = results.SelectMany(x => x.Item3);

        return (validationResults, ticketsResults, accountResults);
    }

    private static GetTicketSiteDbCriteria CreateGetTicketSiteDbCriteria(int siteDbGroupId) // NOSONAR
    {
        var criteria = new GetTicketSiteDbCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            //IssueTypeId = query.IssueTypeId
        };

        return criteria;
    }

    private static CheckValidUsernamesCriteria CreateCriteria(CheckValidUsernamesRequest model, IEnumerable<string> transInfoJsonList)
    {
        return new CheckValidUsernamesCriteria
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