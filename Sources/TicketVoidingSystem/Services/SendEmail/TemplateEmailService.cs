using System.Collections.Generic;
using System.IO;
using RazorEngine;
using RazorEngine.Templating;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail;

public interface TemplateEmailService
{
    MailRecordResult Create(MailVoidViewModel mailVoidViewModel, IEnumerable<TicketEmailViewModel> tickets, SiteEmail site, string subject);
}

public class TemplateEmailServiceImp : TemplateEmailService
{
    public MailRecordResult Create(MailVoidViewModel mailVoidViewModel, IEnumerable<TicketEmailViewModel> tickets, SiteEmail site, string subject)
    {
        mailVoidViewModel.Tickets = tickets;
        return new MailRecordResult
        {
            SiteEmail = site,
            Subject = subject,
            EmailBody = GetEmailBody(mailVoidViewModel.TemplatePath, mailVoidViewModel)
        };
    }

    protected virtual string GetEmailBody(string path, MailVoidViewModel model)
    {
        var fullPath = Helper.GetFilePath(path);
        var template = File.ReadAllText(fullPath);
        var key = typeof(MailVoidViewModel) + path;
        return Engine.Razor.RunCompile(template, key, typeof(MailVoidViewModel), model);
    }
}