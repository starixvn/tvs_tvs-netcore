using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;

public interface CheckProviderMistakeTicketsService
{
    Task<CheckProviderMistakeTicketsResultModel> ValidateTickets(string transIds);
}

public class CheckProviderMistakeTicketsServiceImp(IDynamicRepository repository) : CheckProviderMistakeTicketsService
{
    public async Task<CheckProviderMistakeTicketsResultModel> ValidateTickets(string transIds)
    {
        var criteria = new CheckProviderMistakeTicketsCriteria
        {
            TransIds = transIds
        };

        var allResults = new List<CheckProviderMistakeTicketsResultModel>();

        foreach (var db in SiteDbGroupConstant.ServerList)
        {
            criteria.SiteDbGroupId = db.Id;
            var (validationProviderMistake, transInfoAddRequestModels) =
                await repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(criteria);

            allResults.Add(new CheckProviderMistakeTicketsResultModel
            {
                Validation = validationProviderMistake.FirstOrDefault(),
                TransInfoAddRequest = transInfoAddRequestModels.FirstOrDefault()
            });
        }

        return AggregateValidationInMultipleDbServers(allResults);
    }

    private static CheckProviderMistakeTicketsResultModel AggregateValidationInMultipleDbServers(
        IEnumerable<CheckProviderMistakeTicketsResultModel> resultInMultipleDbServers)
    {
        var validations = resultInMultipleDbServers.Select(r => r.Validation).Where(v => v != null);
        var validTransId = validations.Where(x => !string.IsNullOrWhiteSpace(x.ValidTransIds)).SelectMany(v => v.ValidTransIds.Split(',', StringSplitOptions.RemoveEmptyEntries)).Distinct();
        var existingReqTransId = validations.Where(x => !string.IsNullOrWhiteSpace(x.ExistingReqTransIds))
            .SelectMany(v => v.ExistingReqTransIds.Split(',', StringSplitOptions.RemoveEmptyEntries)).Distinct()
            .Except(validTransId);
        var unsupportedTransId = validations.Where(x => !string.IsNullOrWhiteSpace(x.UnsupportedTransIds))
            .SelectMany(v => v.UnsupportedTransIds.Split(',', StringSplitOptions.RemoveEmptyEntries)).Distinct()
            .Except(validTransId);
        var invalidTransId = validations.Where(x => !string.IsNullOrWhiteSpace(x.InvalidTransIds))
            .SelectMany(v => v.InvalidTransIds.Split(',', StringSplitOptions.RemoveEmptyEntries)).Distinct()
            .Except(validTransId).Except(existingReqTransId).Except(unsupportedTransId);
        var validMatchId = validations.Where(x => x.MatchId > 0).Select(x => x.MatchId).FirstOrDefault();

        var transInfoAddRequestModels =
            resultInMultipleDbServers.Select(x => x.TransInfoAddRequest).Where(m => m != null);
        var markTransIds = transInfoAddRequestModels.Where(x => !string.IsNullOrWhiteSpace(x.MarkTransIds)).Select(x => x.MarkTransIds);
        var transInfoAddRequests = transInfoAddRequestModels.Where(x => !string.IsNullOrWhiteSpace(x.TransInfoJson)).Select(x => x.TransInfoJson);

        var aggregatedValidation = new ValidationProviderMistake
        {
            ValidTransIds = string.Join(",", validTransId),
            InvalidTransIds = string.Join(",", invalidTransId),
            ExistingReqTransIds = string.Join(",", existingReqTransId),
            UnsupportedTransIds = string.Join(",", unsupportedTransId),
            MatchId = validMatchId,
        };
        var aggregatedTransInfo = new TransInfoAddRequestModel
        {
            MarkTransIds = string.Join(",", markTransIds),
            TransInfoJson = string.Join(",", transInfoAddRequests),
        };

        return new CheckProviderMistakeTicketsResultModel
        {
            Validation = aggregatedValidation,
            TransInfoAddRequest = aggregatedTransInfo
        };
    }
}