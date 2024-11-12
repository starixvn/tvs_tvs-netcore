using SpecialDelete.UploadBatchMessage.Criteria;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendMessage;

namespace SpecialDelete.UploadBatchMessage.Services;

public interface BatchMessageService
{
    Task<MessageResult> GetReceivedUsers(CheckTransIdsQueryModel query);

    Task<Result> UpdateMessage(UpdateMessageQueryModel query);
}

public class BatchMessageServiceImp(
    UploadBatchMessageRepository repository,
    SendMessageService sendMessageService,
    MessageItemService messageItemService,
    LoggingService loggingService)
    : BatchMessageService
{
    public async Task<MessageResult> GetReceivedUsers(CheckTransIdsQueryModel query)
    {
        var criteria = new GetReceivedUsersCriteria
        {
            TransIds = query.TransIds,
            ProductIds = query.ProductIds,
            GroupName = query.GroupName
        };

        return await repository.GetReceivedUsers(criteria);
    }

    public async Task<Result> UpdateMessage(UpdateMessageQueryModel query)
    {
        var result = new Result();
        try
        {
            result.ErrorMsg = await SendMessage(query);
        }
        catch (Exception exception)
        {
            result = await ThrowException(exception);
        }

        return result;
    }

    private async Task<string> SendMessage(UpdateMessageQueryModel query)
    {
        var messageId = await sendMessageService.InsertMessageIdForBatchMessage(query.Message, 0, query.MessageContentType);

        var messageXml = messageItemService.CreateMessageItems(query.CreditTrans, messageId);

        if (!string.IsNullOrWhiteSpace(messageXml))
        {
            await sendMessageService.InsertBatchMessage(query.Message.CreatorId, messageXml);
        }

        return StringResource.UpdateBatchMessageSuccess;
    }

    private async Task<Result> ThrowException(Exception exception)
    {
        await loggingService.ErrorAsync(exception);
        return new Result { ErrorCode = 1, ErrorMsg = exception.Message };
    }
}