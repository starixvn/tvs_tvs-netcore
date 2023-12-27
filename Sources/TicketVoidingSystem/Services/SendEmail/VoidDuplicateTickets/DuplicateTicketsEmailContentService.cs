using System.Collections.Generic;
using System.IO;
using System.Linq;
using Fanex.MailDeliver.Model;
using Force.DeepCloner;
using RazorEngine;
using RazorEngine.Templating;
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
        mailVoidViewModel.CcList = specialPlatformService.IsSiteJollySportsPlatform(site) ? "cs@jollysports.com" : "cs@oneonone-solutions.com";
        mailVoidViewModel.SenderName = specialPlatformService.IsSiteJollySportsPlatform(site) ? "CS JOLLY SPORTS" : "CS ONEONONE.SOLUTIONS";
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
        var key = typeof(DuplicateTicketsMailVoidViewModel) + path;
        return Engine.Razor.RunCompile(template, key, typeof(DuplicateTicketsMailVoidViewModel), model);
    }
}