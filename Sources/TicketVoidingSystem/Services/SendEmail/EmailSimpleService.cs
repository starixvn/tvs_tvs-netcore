using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;

namespace TicketVoidingSystem.Services.SendEmail;

public interface EmailSimpleService
{
    Task Send(MailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets, EmailGroup group, bool isFromAfterVoidService);
}

public class EmailSimpleServiceImp : EmailSimpleService
{
    private readonly VoidEmailContentService voidEmailContentService;
    private readonly FanexMailApiService fanexMailApiService;

    public EmailSimpleServiceImp(VoidEmailContentService voidEmailContentService, FanexMailApiService fanexMailApiService)
    {
        this.voidEmailContentService = voidEmailContentService;
        this.fanexMailApiService = fanexMailApiService;
    }

    public async Task Send(MailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<TicketEmailModel> tickets, EmailGroup group, bool isFromAfterVoidService)
    {
        try
        {
            var mailRecord = await voidEmailContentService.Create(mailVoidViewModel, site, tickets, group, isFromAfterVoidService);
            fanexMailApiService.SendEmail(mailRecord);
        }
        catch (Exception exception)
        {
            await fanexMailApiService.WriteLog(group, exception);
        }
    }
}