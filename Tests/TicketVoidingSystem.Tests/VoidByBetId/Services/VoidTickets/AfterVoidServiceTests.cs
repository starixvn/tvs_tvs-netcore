using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendEmail.Void;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.VoidTickets;

[Category("VoidByBetId")]
public class AfterVoidServiceTests
{
    private readonly IMapper _mapper;
    private readonly SendMessageByPlatformService _sendMessageByPlatformService;
    private readonly SendEmailService _sendEmailService;
    private readonly LetstalkService _letstalkService;
    private readonly AfterVoidService _service;

    public AfterVoidServiceTests()
    {
        _mapper = Substitute.For<IMapper>();
        _sendMessageByPlatformService = Substitute.For<SendMessageByPlatformService>();
        _sendEmailService = Substitute.For<SendEmailService>();
        _letstalkService = Substitute.For<LetstalkService>();

        _service = new AfterVoidServiceImp(
            _mapper,
            _sendMessageByPlatformService,
            _sendEmailService,
            _letstalkService
        );
    }

    [Fact]
    public async Task SendMessage_WithNormalBet_ShouldSendMessageToAdminSite()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Match = new Match { Name = "Test Match" },
            Message = new Message { ContentEnglish = "Test Message" },
            Reason = "Test Reason",
            ReasonSC = "Test Reason SC",
            IssueTypeId = 1,
            SubIssueTypeId = 2,
            AbnormalBetType = null
        };

        var tickets = new List<TicketEmailModel>();

        // Act
        await _service.SendMessage(query, tickets);

        // Assert
        await _sendMessageByPlatformService.Received().Execute(Arg.Is<SendMessageTargetParam>(p =>
            p.Match.Name == query.Match.Name &&
            p.Message.ContentEnglish == query.Message.ContentEnglish &&
            p.Reason == query.Reason &&
            p.ReasonSC == query.ReasonSC &&
            p.IssueTypeId == query.IssueTypeId &&
            p.SubIssueTypeId == query.SubIssueTypeId &&
            p.IsSendMessageToAdminSite == true &&
            p.IsMessageContentAbnormal == false
        ));
    }

    [Fact]
    public async Task SendMessage_WithAbnormalBet_ShouldNotSendMessageToAdminSite()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Match = new Match { Name = "Test Match" },
            Message = new Message { ContentEnglish = "Test Message" },
            Reason = "Test Reason",
            ReasonSC = "Test Reason SC",
            IssueTypeId = 1,
            SubIssueTypeId = 2,
            AbnormalBetType = 0 // AbnormalBetSingle
        };

        var tickets = new List<TicketEmailModel>();

        // Act
        await _service.SendMessage(query, tickets);

        // Assert
        await _sendMessageByPlatformService.Received().Execute(Arg.Is<SendMessageTargetParam>(p =>
            p.Match.Name == query.Match.Name &&
            p.Message.ContentEnglish == query.Message.ContentEnglish &&
            p.Reason == query.Reason &&
            p.ReasonSC == query.ReasonSC &&
            p.IssueTypeId == query.IssueTypeId &&
            p.SubIssueTypeId == query.SubIssueTypeId &&
            p.IsSendMessageToAdminSite == false &&
            p.IsMessageContentAbnormal == true
        ));
    }

    [Fact]
    public async Task SendEmail_WithNormalBet_ShouldSendEmailWithoutSubIssueType()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Reason = "Test Reason",
            ReasonSC = "Test Reason SC",
            AbnormalBetType = null
        };

        var tickets = new List<TicketEmailModel>();
        var emailModel = new EmailVoidModel();

        _mapper.Map<EmailVoidModel>(query).Returns(emailModel);
        _sendEmailService.SendEmail(emailModel, tickets).Returns(new List<Result>());

        // Act
        await _service.SendEmail(query, tickets);

        // Assert
        await _sendEmailService.Received().SendEmail(emailModel, tickets);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    public async Task SendEmail_WithAbnormalBet_ShouldSendEmailWithSubIssueType(byte abnormalBetType)
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            Reason = "Test Reason",
            ReasonSC = "Test Reason SC",
            SubIssueTypeName = "Test SubIssue",
            SubIssueTypeNameCS = "Test SubIssue CS",
            AbnormalBetType = abnormalBetType // AbnormalBetSingle
        };

        var tickets = new List<TicketEmailModel>();
        var emailModel = new EmailVoidModel
        {
            Reason = "Test Reason",
            ReasonSC = "Test Reason SC"
        };
        _mapper.Map<EmailVoidModel>(query).Returns(emailModel);
        _sendEmailService.SendEmail(emailModel, tickets).Returns(new List<Result>());

        // Act
        await _service.SendEmail(query, tickets);

        // Assert
        Assert.Equal("Test Reason(Test SubIssue)", emailModel.Reason);
        Assert.Equal("Test Reason SC(Test SubIssue CS)", emailModel.ReasonSC);
        await _sendEmailService.Received().SendEmail(emailModel, tickets);
    }

    [Fact]
    public async Task SendLetstalk_ShouldCallLetstalkService()
    {
        // Arrange
        var query = new VoidTicketsQuery();
        var model = new VoidTicketsModel();
        var expectedResults = new List<Result>();

        _letstalkService.Send(query, model).Returns(expectedResults);

        // Act
        var results = await _service.SendLetstalk(query, model);

        // Assert
        Assert.Equal(expectedResults, results);
        await _letstalkService.Received().Send(query, model);
    }
}