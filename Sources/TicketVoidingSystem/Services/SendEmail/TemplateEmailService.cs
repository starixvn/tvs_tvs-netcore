using System;
using System.Collections.Generic;
using System.IO;
using RazorEngine;
using RazorEngine.Templating;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail;

public interface TemplateEmailService
{
    MailRecordResult Create(MailVoidViewModel mailVoidViewModel, IEnumerable<TicketEmailViewModel> tickets, SiteEmail site, string subject);
}

public class TemplateEmailServiceImp : TemplateEmailService
{
    public MailRecordResult Create(MailVoidViewModel mailVoidViewModel, IEnumerable<TicketEmailViewModel> tickets, SiteEmail site, string subject)
    {
        return new MailRecordResult
        {
            SiteEmail = site,
            Subject = subject,
            EmailBody = GetEmailBody(mailVoidViewModel.TemplatePath, mailVoidViewModel)
        };
    }

    public virtual string GetEmailBody<T>(string path, T model)
    {
        var fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
        var template = File.ReadAllText(fullPath);
        var key = typeof(T) + path;
        return Engine.Razor.RunCompile(template, key, typeof(T), model);
    }
}