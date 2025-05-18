using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;

public interface CheckProviderMistakeTicketsService
{
    Task<CheckProviderMistakeTicketsResultModel> ValidateTickets(string transIds);
}

public class CheckProviderMistakeTicketsServiceImp(IDynamicRepository repository, GetTransInfoService getTransInfoService) : CheckProviderMistakeTicketsService
{
    public async Task<CheckProviderMistakeTicketsResultModel> ValidateTickets(string transIds)
    {
        var transInfoJsonList = await GetTransInfoJson(transIds);
        var criteria = GetCriteria(transIds, transInfoJsonList);
        var (validationProviderMistake, transInfoAddRequestModels) =
            await repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(criteria);

        var validation = validationProviderMistake.FirstOrDefault();
        var transInfoAddRequest = transInfoAddRequestModels.FirstOrDefault();

        var viewModel = new CheckProviderMistakeTicketsResultModel
        {
            Validation = validation,
            TransInfoAddRequestModel = transInfoAddRequest
        };

        return viewModel;
    }

    private static CheckProviderMistakeTicketsCriteria GetCriteria(string transIds, IEnumerable<string> transInfoJsonList)
    {
        return new CheckProviderMistakeTicketsCriteria
        {
            TransIds = transIds,
            TransInfoJson = string.Join(",", transInfoJsonList)
        };
    }

    private async Task<IEnumerable<string>> GetTransInfoJson(string transIds)
    {
        var getTransInfoQuery = new GetTransInfoQuery
        {
            IssueTypeId = IssueTypeConstant.TechnicalError,
            TechnicalErrorModel = new TechnicalErrorViewModel
            {
                SubIssueTypeId = SubIssueTypeConstant.TechnicalError_ProviderMistake,
                TransIds = transIds
            }
        };
        var transInfoJsonList = await getTransInfoService.GetTransInfoJson(getTransInfoQuery);
        return transInfoJsonList.Where(x => !string.IsNullOrWhiteSpace(x));
    }
}