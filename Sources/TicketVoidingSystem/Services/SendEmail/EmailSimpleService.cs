using System;
using System.Threading.Tasks;
using Fanex.MailDeliver.MailClient.Model;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail;

public interface EmailSimpleService
{
    Task Send(MailRecord mailRecord, EmailGroup group);
}

public class EmailSimpleServiceImp(FanexMailApiService fanexMailApiService) : EmailSimpleService
{
    public async Task Send(MailRecord mailRecord, EmailGroup group)
    {
        try
        {
            fanexMailApiService.SendEmail(mailRecord, null);
        }
        catch (Exception exception)
        {
            await fanexMailApiService.WriteLog(group, exception);
        }
    }
}