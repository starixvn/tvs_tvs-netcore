using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.LetstalkService.Client;
using Fanex.LetstalkService.Core.Models;
using TicketVoidingSystem.Constants;
using Result = TicketVoidingSystem.Models.Result;

namespace TicketVoidingSystem.Services.Letstalk;

public interface LetstalkSingleMessageService
{
    Task<Result> Send(LetstalkModel model, LetstalkAttachment attachment);
}

public class LetstalkSingleMessageServiceImp : LetstalkSingleMessageService
{
    private readonly LetstalkClientService letstalkService;
    private readonly LoggingService loggingService;

    public LetstalkSingleMessageServiceImp(LetstalkClientService letstalkService, LoggingService loggingService)
    {
        this.letstalkService = letstalkService;
        this.loggingService = loggingService;
    }

    public async Task<Result> Send(LetstalkModel model, LetstalkAttachment attachment)
    {
        try
        {
            return SendSingleMessage(model, attachment);
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync(exception.Message);
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
            finalModel.LetstalkAttachments = new List<LetstalkAttachment>
                {
                    new() {
                        FileName = attachment.FileName,
                        Bytes = attachment.Bytes
                    }
                };
        }

        return finalModel;
    }
}