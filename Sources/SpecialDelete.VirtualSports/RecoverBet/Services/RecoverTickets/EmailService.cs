using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface EmailService
{
    void SendEmail(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover);
}

public class EmailServiceImp : EmailService
{
    private readonly FanexMailApiService fanexMailApiService;
    private readonly EmailRecordService recordService;

    public EmailServiceImp(
        FanexMailApiService fanexMailApiService,
        EmailRecordService recordService)
    {
        this.fanexMailApiService = fanexMailApiService;
        this.recordService = recordService;
    }

    public void SendEmail(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover)
    {
        try
        {
            var mailRecord = recordService.Create(model, group, typeOfRecover);
            fanexMailApiService.SendEmail(mailRecord);
        }
        catch (Exception exception)
        {
            fanexMailApiService.WriteLog(group, exception);
        }
    }
}