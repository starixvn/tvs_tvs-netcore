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
    private readonly SendEmailService sendEmailService;
    private readonly EmailRecordService recordService;

    public EmailServiceImp(
        SendEmailService sendEmailService,
        EmailRecordService recordService)
    {
        this.sendEmailService = sendEmailService;
        this.recordService = recordService;
    }

    public void SendEmail(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover)
    {
        try
        {
            var mailRecord = recordService.Create(model, group, typeOfRecover);
            sendEmailService.SendEmail(mailRecord);
        }
        catch (Exception exception)
        {
            sendEmailService.WriteLog(group, exception);
        }
    }
}