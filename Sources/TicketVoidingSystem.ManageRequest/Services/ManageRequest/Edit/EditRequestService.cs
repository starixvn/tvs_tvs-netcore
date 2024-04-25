using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;

public interface EditRequestService
{
    Task<Result> UpdateRequest(EditRequestQuery query);
}

public class EditRequestServiceImp : EditRequestService
{
    private readonly LoggingService loggingService;
    private readonly MarkTicketsWhenAddEditService marketTicketsWhenEditService;
    private readonly ReCalculateTicketsService reCalculateTicketsService;
    private readonly UpdateRequestProcessStage updateRequestProcessStage;

    public EditRequestServiceImp(
        LoggingService loggingService,
        MarkTicketsWhenAddEditService marketTicketsWhenEditService,
        ReCalculateTicketsService reCalculateTicketsService,
        UpdateRequestProcessStage updateRequestProcessStage)
    {
        this.loggingService = loggingService;
        this.marketTicketsWhenEditService = marketTicketsWhenEditService;
        this.reCalculateTicketsService = reCalculateTicketsService;
        this.updateRequestProcessStage = updateRequestProcessStage;
    }

    public async Task<Result> UpdateRequest(EditRequestQuery query)
    {
        try
        {
            var markTicketResults = new List<Result>();
            if (!query.IssueTypeId.IsArchivedTicket() && !query.IssueTypeId.RecoverTicket())
            {
                markTicketResults = (await marketTicketsWhenEditService.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds)).ToList();
            }

            return markTicketResults.TrueForAll(x => x.IsSuccessful)
                ? await ExecuteReCalculateAndUpdateRequest(query)
                : markTicketResults.First(x => !x.IsSuccessful);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception);

            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = exception.Message
            };
        }
    }

    private async Task<Result> ExecuteReCalculateAndUpdateRequest(EditRequestQuery query)
    {
        var reCalcTicketsAbnormalResults = Enumerable.Empty<Result>();
        if ((query.IssueTypeId.IsAbnormalBet() || query.IssueTypeId.IsAbnormalBetRealMember())
            && !string.IsNullOrWhiteSpace(query.RemoveTransIds) && query.AbnormalBetInfo.IsConfirmCalculator)
        {
            reCalcTicketsAbnormalResults = await reCalculateTicketsService.Execute(query.MatchId, query.RemoveTransIds);
        }

        return reCalcTicketsAbnormalResults.All(x => x.IsSuccessful)
            ? await updateRequestProcessStage.Execute(query)
            : reCalcTicketsAbnormalResults.First(x => !x.IsSuccessful);
    }
}