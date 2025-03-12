using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using ResultTicket = (TicketVoidingSystem.ManageRequest.ViewModels.ValidationInfo ValidationInfo
    , System.Collections.Generic.IEnumerable<TicketVoidingSystem.ManageRequest.Models.TicketCalculateWinLostAccount> Tickets,
    System.Collections.Generic.IEnumerable<TicketVoidingSystem.ManageRequest.Models.AccountWinlostModel> Accounts);

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface CheckUsernameService
{
    Task<CheckUsernamesInDatabaseResult> GetUsernameInfo(CheckValidUsernamesRequest request);
}

public class CheckUsernameServiceImp(IDynamicRepository repository, GetTransInfoService getTransInfoService)
    : CheckUsernameService
{
    public async Task<CheckUsernamesInDatabaseResult> GetUsernameInfo(CheckValidUsernamesRequest request)
    {
        var results = await GetUsernameInfoAllSites(request);

        return new CheckUsernamesInDatabaseResult
        {
            ValidationResult = results.ValidationInfo,
            TicketCalculateWinLostAccount = results.Tickets,
            AccountWinlost = results.Accounts
        };
    }

    private async Task<ResultTicket> GetUsernameInfoAllSites(CheckValidUsernamesRequest request)
    {
        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            var criteria = CreateCriteria(request, server.Id);
            return repository.FetchMultipleAsync<ValidationInfo, TicketCalculateWinLostAccount, AccountWinlostModel>(criteria);
        });

        var results = await Task.WhenAll(tasks);

        var validationResults = results.SelectMany(x => x.Item1);
        var ticketsResults = results.SelectMany(x => x.Item2);
        var accountResults = results.SelectMany(x => x.Item3);

        var validationInfo = CreateValidationResult(validationResults);
        return (validationInfo, ticketsResults, accountResults);
    }

    private static ValidationInfo CreateValidationResult(IEnumerable<ValidationInfo> validationResults)
    {
        return new ValidationInfo
        {
            IsExistedInOtherRequest = validationResults.All(x => x.IsExistedInOtherRequest),
            InvalidUserName = string.Join(",", validationResults.Select(x => x.InvalidUserName)),
            MatchIds = string.Join(",", validationResults.Select(x => x.MatchIds)),
            NumberOfTickets = validationResults.Sum(x => x.NumberOfTickets),
            IsInvalidTotalTicket = !validationResults.Any(x => x.IsInvalidTotalTicket),
            IsBeingMoveBetDate = validationResults.All(x => x.IsBeingMoveBetDate),
            UnMarkTransIds = string.Join(",", validationResults.Select(x => x.UnMarkTransIds)),
            MarkTransIds = string.Join(",", validationResults.Select(x => x.MarkTransIds)),
        };
    }

    private static CheckValidUsernamesCriteria CreateCriteria(CheckValidUsernamesRequest request, int siteDbGroupId)
    {
        return new CheckValidUsernamesCriteria
        {
            SiteDbGroupId = siteDbGroupId,
            Usernames = request.Usernames,
            RequestId = request.RequestId,
            ActionId = request.ActionId,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            ProductIds = request.ProductIds,
            StatusIds = request.StatusIds,
            IsVoidAllArchivedTickets = request.IsVoidAllArchivedTickets,
        };
    }
}