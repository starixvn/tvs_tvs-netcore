using Fanex.MailDeliver.Model;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;

namespace TicketVoidingSystem.Services.SendEmail.RecoverSpecialDeletePage;

public interface RecordRecoverService<T, U>
{
    MailRecord Create(MailRecoverModel<T, U> model, EmailGroup group);
}