using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.MailDeliver.MailClient.API;
using Fanex.MailDeliver.Model;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail;

public interface FanexMailApiService
{
    void SendEmail(MailRecord mailRecord);

    Task WriteLog(EmailGroup group, Exception exception);
}

public class FanexMailApiServiceImp : FanexMailApiService
{
    private readonly LoggingService loggingService;

    private static readonly IDictionary<EmailGroup, string> ErrorEmailMap = new Dictionary<EmailGroup, string>
    {
        { EmailGroup.Csd, ErrorSendEmail.Csd },
        { EmailGroup.Recover, ErrorSendEmail.Recover },
        { EmailGroup.CashOut, ErrorSendEmail.CashOut },
        { EmailGroup.ItQa, ErrorSendEmail.It },
        { EmailGroup.ItSupport, ErrorSendEmail.It }
    };

    public FanexMailApiServiceImp(LoggingService loggingService)
    {
        this.loggingService = loggingService;
    }

    public void SendEmail(MailRecord mailRecord)
    {
        if (!string.IsNullOrEmpty(mailRecord.Body))
        {
            SendExistEmail(mailRecord);
        }
    }

    private static void SendExistEmail(MailRecord mailRecord)
    {
        using var mailClient = new MailDeliver();
        mailClient.SendMail(mailRecord);
    }

    public async Task WriteLog(EmailGroup group, Exception exception)
    {
        if (ErrorEmailMap.TryGetValue(group, out var errorMessage))
        {
            await loggingService.ErrorAsync(errorMessage, exception);
        }
        else
        {
            await loggingService.ErrorAsync(ErrorSendEmail.WrongGroup, exception);
        }
    }
}