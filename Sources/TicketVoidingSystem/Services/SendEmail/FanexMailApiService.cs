using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.MailDeliver.MailClient.API;
using Fanex.MailDeliver.MailClient.Model;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendMessage;

namespace TicketVoidingSystem.Services.SendEmail;

public interface FanexMailApiService
{
    void SendEmail(MailRecord mailRecord, SiteEmail site);

    Task WriteLog(EmailGroup group, Exception exception);
}

public class FanexMailApiServiceImp : FanexMailApiService
{
    private readonly LoggingService loggingService;
    private readonly SpecialPlatformService specialPlatformService;

    private static readonly IDictionary<EmailGroup, string> ErrorEmailMap = new Dictionary<EmailGroup, string>
    {
        { EmailGroup.Csd, ErrorSendEmail.Csd },
        { EmailGroup.Recover, ErrorSendEmail.Recover },
        { EmailGroup.CashOut, ErrorSendEmail.CashOut },
        { EmailGroup.ItQa, ErrorSendEmail.It },
        { EmailGroup.ItSupport, ErrorSendEmail.It }
    };

    public FanexMailApiServiceImp(LoggingService loggingService, SpecialPlatformService specialPlatformService)
    {
        this.loggingService = loggingService;
        this.specialPlatformService = specialPlatformService;
    }

    public void SendEmail(MailRecord mailRecord, SiteEmail site)
    {
        if (!string.IsNullOrEmpty(mailRecord.Body))
        {
            SendExistEmail(mailRecord, site);
        }
    }

    private void SendExistEmail(MailRecord mailRecord, SiteEmail site)
    {
        specialPlatformService.ChangeAppMailIdForSiteJollyPlatform(site);
        mailRecord.Title = specialPlatformService.GetTitleForMailRecord(site);
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