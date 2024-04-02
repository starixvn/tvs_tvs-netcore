using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.MailDeliver.MailClient.Model;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Void;

public class VoidEmailContentServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly VoidEmailContentServiceImp service;
    private readonly SubjectService subjectService;
    private readonly TemplateEmailService templateEmailService;
    private readonly TicketService ticketService;

    public VoidEmailContentServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        ticketService = Substitute.For<TicketService>();
        subjectService = Substitute.For<SubjectService>();
        templateEmailService = Substitute.For<TemplateEmailService>();
        service = new VoidEmailContentServiceImp(repository, ticketService, subjectService, templateEmailService);
    }

    [Fact]
    public async void Create_HasNoValidTicket_ReturnNewMailRecord()
    {
        // Arrange
        var tickets = new List<TicketEmailModel>();
        var site = new SiteEmail();
        var expected = new MailRecord();

        // Act
        var actual = await service.Create(null, site, tickets, EmailGroup.CashOut, true);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Theory]
    [InlineData(false, IssueTypeConstant.AbnormalBet)]
    [InlineData(false, IssueTypeConstant.AbnormalAccount)]
    [InlineData(true, IssueTypeConstant.DangerAccepted)]
    [InlineData(false, IssueTypeConstant.RedCard)]
    [InlineData(false, IssueTypeConstant.WrongScore)]
    public async Task Create_HasValidTicketAndSite_ReturnExpectedMailRecord(bool isFilterByUserName, int issueTypeId)
    {
        // Arrange
        var tickets = new List<TicketEmailModel> { new() { Recommend = 1 }, new() { IsCancelCashOut = true } };
        var site = new SiteEmail { ToList = "1;2;3" };
        var mailRecordResult = new MailRecordResult
        {
            SiteEmail = new SiteEmail
            {
                ToList = "1;2;3",
                CcList = "CcList",
                BccList = "BccList"
            },
            Subject = "Subject",
            EmailBody = "EmailBody"
        };
        var mailVoidViewModel = new MailVoidViewModel
        {
            IssueTypeId = issueTypeId,
            IsFilterByUserName = isFilterByUserName
        };
        repository.FetchAsync<GetOperatorInfoModel>(Arg.Any<GetOperatorInfoCriteria>())
            .ReturnsForAnyArgs(new List<GetOperatorInfoModel> { new() { AgentId = 1, OperatorID = "11" } });
        ticketService.GetTicket(Arg.Any<TicketEmailModel>(), Arg.Any<Match>(), true)
            .ReturnsForAnyArgs(new TicketEmailViewModel());
        subjectService.CreateVoid(Arg.Any<MailVoidViewModel>(), tickets.Select(x => x.Site),
            Arg.Any<SiteEmail>(), Arg.Any<EmailGroup>(), Arg.Any<VoidType>()).ReturnsForAnyArgs("subject");
        templateEmailService.Create(Arg.Any<MailVoidViewModel>(),
                Arg.Any<SiteEmail>(), "subject")
            .ReturnsForAnyArgs(mailRecordResult);

        // Act
        var actual = await service.Create(mailVoidViewModel, site, tickets, EmailGroup.CashOut, true);

        // Assert
        AssertExtension.Equal(mailRecordResult.MailRecord, actual);
        templateEmailService.Received(1).Create(Arg.Any<MailVoidViewModel>(),
            Arg.Any<SiteEmail>(), "subject");
    }
}