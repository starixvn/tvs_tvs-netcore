using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services.SendEmail;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;

public interface EmailService
{
    void SendEmail(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover);
}

public class EmailServiceImp(
    FanexMailApiService fanexMailApiService,
    EmailRecordService recordService)
    : EmailService
{
    public void SendEmail(MailRecoverModel<MailTicketViewModel, RecoverTicketModel> model, EmailGroup group, Recover typeOfRecover)
    {
        try
        {
            var mailRecord = recordService.Create(model, group, typeOfRecover);
            fanexMailApiService.SendEmail(mailRecord, null);
        }
        catch (Exception exception)
        {
            fanexMailApiService.WriteLog(group, exception);
        }
    }
}