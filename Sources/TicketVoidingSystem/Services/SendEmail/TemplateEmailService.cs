using System.IO;
using RazorEngine;
using RazorEngine.Templating;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail;

public interface TemplateEmailService
{
    MailRecordResult Create(MailVoidViewModel mailVoidViewModel, SiteEmail site, string subject);

    MailRecordResult CreateForRecover<T, U>(MailRecoverModel<T, U> model, string subject);
}

public class TemplateEmailServiceImp : TemplateEmailService
{
    public MailRecordResult Create(MailVoidViewModel mailVoidViewModel, SiteEmail site, string subject)
    {
        return new MailRecordResult
        {
            SiteEmail = site,
            Subject = subject,
            EmailBody = GetEmailBody(mailVoidViewModel.TemplatePath, mailVoidViewModel)
        };
    }

    public MailRecordResult CreateForRecover<T, U>(MailRecoverModel<T, U> model, string subject)
    {
        return new MailRecordResult
        {
            SiteEmail = model.Site,
            Subject = subject,
            EmailBody = GetEmailBody(model.ViewModel.TemplatePath, model.ViewModel)
        };
    }

    private static string GetEmailBody<T>(string path, T model)
    {
        var fullPath = Helper.GetFilePath(path);
        var template = File.ReadAllText(fullPath);
        var key = typeof(T) + path;
        return Engine.Razor.RunCompile(template, key, typeof(T), model);
    }
}