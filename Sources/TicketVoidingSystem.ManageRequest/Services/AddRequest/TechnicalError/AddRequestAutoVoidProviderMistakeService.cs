using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;

public interface AddRequestAutoVoidProviderMistakeService
{
    Task<(CheckProviderMistakeTicketsResultModel Result, Result Error)> ValidateTickets(string transId);

    Task<Result> MarkTickets(TransInfoAddRequestModel transInfo);

    Task<(int RequestId, Result Result)> ExecuteAddRequest(int matchId, CheckProviderMistakeTicketsResultModel validationResult);
}

public class AddRequestAutoVoidProviderMistakeServiceImp(
    CheckProviderMistakeTicketsService checkProviderMistakeTicketsService,
    MarkTicketsWhenAddEditService markTicketsWhenAddEditService,
    GetUpdateResultService getUpdateResultService,
    IDynamicRepository repository) : AddRequestAutoVoidProviderMistakeService
{
    public async Task<(CheckProviderMistakeTicketsResultModel Result, Result Error)> ValidateTickets(string transId)
    {
        var validationResult = await checkProviderMistakeTicketsService.ValidateTickets(transId);

        if (!string.IsNullOrEmpty(validationResult.Validation.InvalidTransIds))
        {
            return (null, new Result { ErrorCode = 1, ErrorMsg = $"Invalid transaction IDs: {validationResult.Validation.InvalidTransIds}" });
        }

        if (!string.IsNullOrEmpty(validationResult.Validation.ExistingReqTransIds))
        {
            return (null, new Result { ErrorCode = 1, ErrorMsg = $"Existing in other request transaction IDs: {validationResult.Validation.ExistingReqTransIds}" });
        }

        if (validationResult.TransInfoAddRequestModel == null)
        {
            return (null, new Result { ErrorCode = 1, ErrorMsg = "Failed to select tickets" });
        }

        return (validationResult, null);
    }

    public async Task<Result> MarkTickets(TransInfoAddRequestModel transInfo)
    {
        var markTicketResult = await markTicketsWhenAddEditService.Execute(
            IssueTypeConstant.TechnicalError,
            transInfo.MarkTransIds,
            string.Empty);

        var markTicketError = getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService));
        return markTicketError ?? new Result { ErrorCode = 0, ErrorMsg = string.Empty };
    }

    public async Task<(int RequestId, Result Result)> ExecuteAddRequest(int matchId, CheckProviderMistakeTicketsResultModel validationResult)
    {
        var command = CreateAddRequestCommand(matchId, validationResult);
        await repository.ExecuteAsync(command);

        if (command.RequestId <= 0)
        {
            return (0, new Result { ErrorCode = 1, ErrorMsg = "Failed to add void request" });
        }

        return (command.RequestId, new Result { ErrorCode = 0, ErrorMsg = $"Successfully add void request: {command.RequestId}" });
    }

    private static AddRequestCommand CreateAddRequestCommand(int matchId, CheckProviderMistakeTicketsResultModel validationResult)
    {
        return new AddRequestCommand
        {
            IssueTypeId = IssueTypeConstant.TechnicalError,
            ActionId = VoidActionTypeConstant.AutoVoidInstantId,
            DecidedBy = AutoVoidConstant.ActorName,
            UserId = AutoVoidConstant.ActorId,
            IP = AutoVoidConstant.IPAddress,
            IsTest = false,
            TransInfoJson = validationResult.TransInfoAddRequestModel.TransInfoJson,
            TechnicalErrorInfo = new TechnicalErrorViewModel
            {
                MatchId = matchId,
                SubIssueTypeId = SubIssueTypeConstant.TechnicalError_ProviderMistake
            }.ToEventTechnicalErrorProviderMistakeXml()
        };
    }
}