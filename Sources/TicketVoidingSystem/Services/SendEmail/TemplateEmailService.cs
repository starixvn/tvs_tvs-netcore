using System.Collections.Concurrent;
using System.IO;
using RazorEngineCore;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail;

public interface TemplateEmailService
{
    MailRecordResult Create(MailVoidViewModel mailVoidViewModel, SiteEmail site, string subject);

    MailRecordResult CreateForRecover<T, U>(MailRecoverModel<T, U> model, string subject);

    MailRecordResult CreateForRecover(MailRecoverViewModel viewModel, SiteEmail site, string subject);
}

public class TemplateEmailServiceImp : TemplateEmailService
{
    private static readonly ConcurrentDictionary<int, IRazorEngineCompiledTemplate> CompiledTemplateCache = new();

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

    public MailRecordResult CreateForRecover(MailRecoverViewModel viewModel, SiteEmail site, string subject)
    {
        return new MailRecordResult
        {
            SiteEmail = site,
            Subject = subject,
            EmailBody = GetEmailBody(viewModel.TemplatePath, viewModel)
        };
    }

    private static string GetEmailBody<T>(string path, T model)
    {
        var fullPath = Helper.GetFilePath(path);
        var template = File.ReadAllText(fullPath);

        var hashCode = template.GetHashCode();
        var compiledTemplate = CompiledTemplateCache.GetOrAdd(hashCode, _ =>
        {
            var razorEngine = new RazorEngine();
            return razorEngine.Compile(template);
        });

        return compiledTemplate.Run(model);
    }
}