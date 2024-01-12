using System;
using System.Collections.Generic;
using Fanex.MailDeliver.Model;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Recover;
using TicketVoidingSystem.Services.SendEmail.Subject;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Recover;

public class RecoverEmailContentServiceTests
{
    [Fact]
    public void Create_NoHasTickets_ReturnExpected()
    {
        // Arrange
        var tickets = new List<TicketRecoverEmailModel>();
        var service = new RecoverEmailContentServiceImp(null, null, null, null);
        var expected = new MailRecord();

        // Act
        var actual = service.Create(default, tickets, default, default);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void Create_ValidData_ReturnExpected()
    {
        // Arrange
        var viewModel = new MailRecoverViewModel { };
        var siteEmail = new SiteEmail
        {
            ToList = "1, 2"
        };
        const EmailGroup group = EmailGroup.CashOut;
        var groups = new List<Group<TicketRecoverEmailModel>>
        {
            new()
            {
                Name = "a",
                Tickets = new List<TicketRecoverEmailModel>
                {
                    new()
                }
            }
        };
        var tickets = new List<TicketRecoverEmailModel> { new() };
        const string mailSubject = "mailSubject";
        var mailRecord = new MailRecordResult
        {
            SiteEmail = siteEmail,
            Subject = "SportBook"
        };
        var subjectService = Substitute.For<SubjectService>();
        var templateEmailService = Substitute.For<TemplateEmailService>();
        var recoverTicketService = Substitute.For<RecoverTicketService>();
        var pagingService = Substitute.For<PagingService>();
        recoverTicketService.Render(Arg.Any<TicketRecoverEmailModel>()).ReturnsForAnyArgs(new TicketRecoverEmailViewModel { Stake = "" });
        subjectService.CreateRecover(viewModel, group, RecoverType.Default).ReturnsForAnyArgs(mailSubject);
        templateEmailService.CreateForRecover(viewModel, siteEmail, mailSubject).ReturnsForAnyArgs(mailRecord);
        pagingService.Groups(tickets, Arg.Any<Func<TicketRecoverEmailModel, string>>()).ReturnsForAnyArgs(groups);
        var service = new RecoverEmailContentServiceImp(subjectService, templateEmailService, recoverTicketService, pagingService);

        // Act
        var actual = service.Create(viewModel, tickets, siteEmail, group);

        // Assert
        AssertExtension.Equal(mailRecord.MailRecord, actual);
    }
}