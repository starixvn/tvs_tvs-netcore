using System;
using System.Collections.Generic;
using AutoMapper;
using Fanex.MailDeliver.Model;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets;

public class EmailRecordServiceTest
{
    private MailRecordResult FakeMailRecordResult()
    {
        return new MailRecordResult
        {
            EmailBody = "Email Body",
            SiteEmail = new SiteEmail(),
            Subject = "Subject"
        };
    }

    [Fact]
    public void Create_HasTicketsAndExistToListInSite_ReturnFakeRecordResult()
    {
        // Arrange
        var model = new MailRecoverModel<MailTicketViewModel, RecoverTicketModel>
        {
            Tickets = new List<RecoverTicketModel> { new() { Status = string.Empty } },
            ViewModel = new MailRecoverViewModel<MailTicketViewModel>(),
            Site = new SiteEmail { ToList = "a@xyz" }
        };
        const string fakeSubject = "TEST";
        var subjectService = Substitute.For<SubjectService>();
        subjectService.CreateRecover(
            Arg.Any<MailRecoverModel<MailTicketViewModel, RecoverTicketModel>>(),
            EmailGroup.None, RecoverType.VirtualSports).ReturnsForAnyArgs(fakeSubject);
        var templateEmailService = Substitute.For<TemplateEmailService>();
        templateEmailService.CreateForRecover(
                Arg.Any<MailRecoverModel<MailTicketViewModel, RecoverTicketModel>>(), fakeSubject)
            .ReturnsForAnyArgs(FakeMailRecordResult());

        var displayTicketService = Substitute.For<TicketService>();
        displayTicketService.GetTicket(Arg.Any<RecoverTicketModel>(), Arg.Any<Recover>())
            .ReturnsForAnyArgs(new TicketViewModel());
        var pagingService = Substitute.For<PagingService>();
        pagingService.Groups(Arg.Any<List<RecoverTicketModel>>(), ticket => ticket.GroupName)
            .ReturnsForAnyArgs(
                new List<Group<RecoverTicketModel>>
                {
                    new()
                    {
                        Tickets = new List<RecoverTicketModel> { new() }
                    }
                });
        var mapper = Substitute.For<IMapper>();
        mapper.Map<MailTicketViewModel>(null).ReturnsForAnyArgs(new MailTicketViewModel());
        var service = new EmailRecordServiceImp(
            mapper,
            subjectService,
            templateEmailService,
            displayTicketService,
            pagingService);

        // Act
        var actual = service.Create(model, EmailGroup.None, new Recover());

        // Assert
        pagingService.Received(1).Groups(Arg.Any<List<RecoverTicketModel>>(),
            Arg.Any<Func<RecoverTicketModel, string>>());
        AssertExtension.Equal(FakeMailRecordResult().MailRecord, actual);
    }

    [Fact]
    public void Create_HasTicketsButEmptyToListInSite_ReturnEmptyMailRecord()
    {
        // Arrange
        var expected = new MailRecord();
        var model = new MailRecoverModel<MailTicketViewModel, RecoverTicketModel>
        {
            Tickets = new List<RecoverTicketModel> { new() },
            ViewModel = new MailRecoverViewModel<MailTicketViewModel>(),
            Site = new SiteEmail { ToList = string.Empty }
        };
        var subjectService = Substitute.For<SubjectService>();
        var templateEmailService = Substitute.For<TemplateEmailService>();
        var displayTicketService = Substitute.For<TicketService>();
        var pagingService = Substitute.For<PagingService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<MailTicketViewModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(new MailTicketViewModel());
        var service = new EmailRecordServiceImp(
            mapper,
            subjectService,
            templateEmailService,
            displayTicketService,
            pagingService);

        // Act
        var actual = service.Create(model, EmailGroup.None, new Recover());

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void Create_NoneTicketsButExistToListInSite_ReturnEmptyMailRecord()
    {
        // Arrange
        var expected = new MailRecord();
        var model = new MailRecoverModel<MailTicketViewModel, RecoverTicketModel>
        {
            Tickets = new List<RecoverTicketModel>(),
            ViewModel = new MailRecoverViewModel<MailTicketViewModel>(),
            Site = new SiteEmail { ToList = "a@xyz" }
        };
        var service = new EmailRecordServiceImp(null, null, null, null, null);

        // Act
        var actual = service.Create(model, EmailGroup.None, new Recover());

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}