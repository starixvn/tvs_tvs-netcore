using System;
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
        switch (group)
        {
            case EmailGroup.Csd:
                await loggingService.ErrorAsync(ErrorSendEmail.Csd, exception);
                break;

            case EmailGroup.Recover:
                await loggingService.ErrorAsync(ErrorSendEmail.Recover, exception);
                break;

            case EmailGroup.CashOut:
                await loggingService.ErrorAsync(ErrorSendEmail.CashOut, exception);
                break;

            case EmailGroup.ItQa:
            case EmailGroup.ItSupport:
                await loggingService.ErrorAsync(ErrorSendEmail.It, exception);
                break;

            default:
                await loggingService.ErrorAsync(ErrorSendEmail.WrongGroup, exception);
                break;
        }
    }
}