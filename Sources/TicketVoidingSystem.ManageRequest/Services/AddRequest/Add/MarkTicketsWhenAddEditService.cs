using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

public interface MarkTicketsWhenAddEditService
{
    Task<MarkTicketsResult> Execute(int issueTypeId, string markTransIds, string unMarkTransIds);

    Task<ValidateErrorRequestModel> GetStateMarkTickets(EditRequestQuery query);
}

public class MarkTicketsWhenAddEditServiceImp(MarkTicketsService markTicketsService,
    SessionService sessionService, IDynamicRepository dynamicRepository)
    : MarkTicketsWhenAddEditService
{
    public async Task<ValidateErrorRequestModel> GetStateMarkTickets(EditRequestQuery query)
    {
        var criteria = new ValidateErrorRequestCriteria
        {
            RequestId = query.RequestId,
            MarkTransIds = query.MarkTransIds,
            UnMarkTransIds = query.UnMarkTransIds,
            UserId = sessionService.UserId
        };

        return await dynamicRepository.GetAsync<ValidateErrorRequestModel>(criteria);
    }

    public async Task<MarkTicketsResult> Execute(int issueTypeId, string markTransIds, string unMarkTransIds)
    {
        var combineResults = new List<Result>();
        var markedTickets = new List<long>();

        if (issueTypeId.IsArchivedTicket())
        {
            return new MarkTicketsResult
            {
                MarkedResults = combineResults,
                MarkedTickets = markedTickets
            };
        }

        if (!string.IsNullOrWhiteSpace(markTransIds))
        {
            var markResults = await ExecuteMarkTickets(issueTypeId, markTransIds);
            combineResults.AddRange(markResults.MarkedResults);
            markedTickets.AddRange(markResults.MarkedTickets);
        }

        if (string.IsNullOrWhiteSpace(unMarkTransIds))
        {
            return new MarkTicketsResult
            {
                MarkedResults = combineResults,
                MarkedTickets = markedTickets
            };
        }

        var unmarkResults = await ExecuteUnMarkTickets(issueTypeId, unMarkTransIds);
        combineResults.AddRange(unmarkResults.MarkedResults);

        return new MarkTicketsResult
        {
            MarkedResults = combineResults,
            MarkedTickets = markedTickets
        };
    }

    private async Task<MarkTicketsResult> ExecuteMarkTickets(int issueTypeId, string markTransIds)
    {
        return await markTicketsService.MarkTicketsInTVS(markTransIds, issueTypeId, MarkTypeConstant.ExecuteMarkTickets);
    }

    private async Task<MarkTicketsResult> ExecuteUnMarkTickets(int issueTypeId, string unMarkTransIds)
    {
        return await markTicketsService.MarkTicketsInTVS(unMarkTransIds, issueTypeId, MarkTypeConstant.ExecuteUnMarkTickets);
    }
}