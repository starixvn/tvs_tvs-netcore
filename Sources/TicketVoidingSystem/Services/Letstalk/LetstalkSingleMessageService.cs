using System;
using System.Threading.Tasks;
using Fanex.LetstalkService.Client;
using Fanex.LetstalkService.Client.Models;
using TicketVoidingSystem.Constants;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk;

public interface LetstalkSingleMessageService
{
    Task<Result> Send(LetstalkModel model, LetstalkAttachment attachment);
}

public class LetstalkSingleMessageServiceImp(LetstalkClientService letstalkService, LoggingService loggingService)
    : LetstalkSingleMessageService
{
    public async Task<Result> Send(LetstalkModel model, LetstalkAttachment attachment)
    {
        try
        {
            return SendSingleMessage(model, attachment);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(nameof(LetstalkSingleMessageService), exception);
            return new Result { ErrorCode = ErrorCode.SendLetstalkFail, ErrorMsg = exception.Message };
        }
    }

    private Result SendSingleMessage(LetstalkModel model, LetstalkAttachment attachment)
    {
        var isSentOk = letstalkService.SendMessage(CreateLetstalkModelWithAttachmentFile(model, attachment));
        if (isSentOk)
        {
            return new Result();
        }

        return new Result
        {
            ErrorCode = ErrorCode.SendLetstalkFail,
            ErrorMsg = "Error when send message to Letstalk!!!"
        };
    }

    private static LetstalkModel CreateLetstalkModelWithAttachmentFile(LetstalkModel model, LetstalkAttachment attachment)
    {
        var finalModel = new LetstalkModel
        {
            TargetName = model.TargetName,
            Subject = model.Subject,
            Content = model.Content,
            Group = model.Group
        };

        if (!string.IsNullOrWhiteSpace(attachment?.FileName) && attachment.Bytes != null)
        {
            finalModel.LetstalkAttachments =
            [
                new LetstalkAttachment
                {
                    FileName = attachment.FileName,
                    Bytes = attachment.Bytes
                }
            ];
        }

        return finalModel;
    }
}