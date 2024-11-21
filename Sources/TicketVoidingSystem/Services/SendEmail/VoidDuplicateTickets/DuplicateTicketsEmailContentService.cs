using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Fanex.MailDeliver.MailClient.Model;
using Force.DeepCloner;
using RazorEngineCore;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Services.SendMessage;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

public interface DuplicateTicketsEmailContentService
{
    MailRecord Create(DuplicateTicketsMailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets, EmailGroup emailGroup);
}

public class DuplicateTicketsEmailContentServiceImp : DuplicateTicketsEmailContentService
{
    private static readonly ConcurrentDictionary<int, IRazorEngineCompiledTemplate> CompiledTemplateCache = new();

    private readonly DuplicateTicketsSubjectService subjectService;
    private readonly SpecialPlatformService specialPlatformService;

    public DuplicateTicketsEmailContentServiceImp(DuplicateTicketsSubjectService subjectService, SpecialPlatformService specialPlatformService)
    {
        this.subjectService = subjectService;
        this.specialPlatformService = specialPlatformService;
    }

    public MailRecord Create(DuplicateTicketsMailVoidViewModel mailVoidViewModel, SiteEmail site, IEnumerable<DuplicateTicketsRequestInfo> duplicateTickets, EmailGroup emailGroup)
    {
        if (duplicateTickets.Valid(site))
        {
            var subject = subjectService.CreateVoidDuplicateTickets(mailVoidViewModel, duplicateTickets.Select(x => x.Site), site, emailGroup);
            var mailVoidModelClone = mailVoidViewModel.DeepClone();
            mailVoidModelClone.DuplicateTickets = duplicateTickets.ToList();
            mailVoidModelClone.TotalOrgTransIds = duplicateTickets.Sum(x => x.TotalOrgTransIds);
            UpdateEmailSender(mailVoidModelClone, site);
            var mailRecord = Create(mailVoidModelClone, site, subject);

            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private void UpdateEmailSender(DuplicateTicketsMailVoidViewModel mailVoidViewModel, SiteEmail site)
    {
        mailVoidViewModel.DepartmentName = specialPlatformService.GetDepartmentNameForEmailVoidDuplicated(site);
        mailVoidViewModel.ContactAddress = specialPlatformService.GetContactAddressForEmailVoidDuplicated(site);
    }

    private static MailRecordResult Create(DuplicateTicketsMailVoidViewModel mailVoidViewModel, SiteEmail site, string subject)
    {
        return new MailRecordResult
        {
            SiteEmail = site,
            Subject = subject,
            EmailBody = GetEmailBody(mailVoidViewModel.TemplatePath, mailVoidViewModel)
        };
    }

    private static string GetEmailBody(string path, DuplicateTicketsMailVoidViewModel model)
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