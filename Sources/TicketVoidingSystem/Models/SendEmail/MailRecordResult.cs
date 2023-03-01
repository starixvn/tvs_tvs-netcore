using Fanex.MailDeliver.Model;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Models.SendEmail;

public class MailRecordResult
{
    public SiteEmail SiteEmail { get; set; }

    public string Subject { get; set; }

    public string EmailBody { get; set; }

    public MailRecord MailRecord => new MailRecord
    {
        MailTo = SiteEmail.ToList,
        MailCc = SiteEmail.CcList,
        MailBcc = SiteEmail.BccList,
        Title = StringResource.EmailFrom,
        Subject = Subject
            .Replace("[IBO]", "[KZING]")
            .Replace("[BODOG]", "[HAYDOCK]")
            .Replace("[AVIA]", "[ORIENTAL GAME]"),
        Body = EmailBody
    };
}