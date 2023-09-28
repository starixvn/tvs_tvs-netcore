using Fanex.MailDeliver.Model;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail.Recover;

public interface RecordRecoverService<T, U>
{
    MailRecord Create(MailRecoverModel<T, U> model, EmailGroup group);
}