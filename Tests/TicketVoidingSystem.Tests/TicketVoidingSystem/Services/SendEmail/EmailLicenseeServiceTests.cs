using System;
using System.Collections.Generic;
using Fanex.MailDeliver.Model;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class EmailLicenseeServiceTests
{
    private readonly VoidEmailContentService voidEmailContentService;
    private readonly FanexMailApiService fanexMailApiService;
    private readonly MailResultService mailResultService;
    private readonly LeagueNameMessageServiceImp leagueNameMessageService;
    private EmailLicenseeServiceImp service;

    public EmailLicenseeServiceTests()
    {
        voidEmailContentService = Substitute.For<VoidEmailContentService>();
        fanexMailApiService = Substitute.For<FanexMailApiService>();
        mailResultService = Substitute.For<MailResultService>();
        leagueNameMessageService = Substitute.For<LeagueNameMessageServiceImp>();
        service = new EmailLicenseeServiceImp(voidEmailContentService, fanexMailApiService, mailResultService, leagueNameMessageService);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void Send_HasTickets_HasSendEmail(bool isFromAfterVoidService)
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel
        { Match = new Match { LeagueGroupId = 42, LeagueName = "Saba123", LeagueNameSimplified = "沙巴123", LeagueNameNewSimplified = "沙巴123" },
            Message = new Message { ContentEnglish = "SABA123", ContentChineseSimplified = "沙巴123" } };
        var sites = new List<SiteEmail> { new() { Site = "1", IsChinaView = true, ToList = "1;2;3" } };
        var tickets = new List<TicketEmailModel>
            { new() { EmailGroup = "1" }, new() { Currency = CurrencyConstant.UusId } };
        voidEmailContentService.Create(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.Csd, isFromAfterVoidService)
            .ReturnsForAnyArgs(new MailRecord());
        mailResultService.CreateSuccess(Arg.Any<string>(), default, isFromAfterVoidService)
            .ReturnsForAnyArgs(new Result());
        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, isFromAfterVoidService);

        // Assert
        fanexMailApiService.Received(1).SendEmail(Arg.Any<MailRecord>());
    }

    [Fact]
    public void Send_SiteHasToListIsNull_HasCreateFail()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel
        {
            Match = new Match { LeagueGroupId = 42, LeagueName = "Saba123", LeagueNameSimplified = "沙巴123", LeagueNameNewSimplified = "沙巴123" },
            Message = new Message { ContentEnglish = "SABA123", ContentChineseSimplified = "沙巴123" }
        };
        var sites = new List<SiteEmail> { new() { Site = "1", IsChinaView = true } };
        var tickets = new List<TicketEmailModel>
            { new() { EmailGroup = "1" }, new() { Currency = CurrencyConstant.UusId } };
        voidEmailContentService.Create(Arg.Any<MailVoidViewModel>(), Arg.Any<SiteEmail>(),
                Arg.Any<IEnumerable<TicketEmailModel>>(), EmailGroup.Csd, true)
            .ReturnsForAnyArgs(new MailRecord());
        mailResultService.CreateSuccess(Arg.Any<string>(), default, true)
            .ReturnsForAnyArgs(new Result());
        mailResultService.CreateFail("1", true).ReturnsForAnyArgs(new Result());
        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        mailResultService.Received(1).CreateFail("1", true);
    }

    [Theory]
    [InlineData(true, 42)]
    [InlineData(false, 1)]
    [InlineData(true, 1)]
    [InlineData(false, 42)]
    public void Send_HasException_HasWriteLog(bool isChinaView, int leagueGroupId)
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel
        {
            Match = new Match { LeagueGroupId = leagueGroupId },
            Message = new Message { ContentEnglish = "SABA123", ContentChineseSimplified = "沙巴123" }
        };
        var sites = new List<SiteEmail> { new() { Site = "1", IsChinaView = isChinaView, ToList = "1;2;3" } };
        var tickets = new List<TicketEmailModel>
            { new() { EmailGroup = "1" }, new() { Currency = CurrencyConstant.UusId } };
        service = new EmailLicenseeServiceImp(null, fanexMailApiService, mailResultService, leagueNameMessageService);
        mailResultService.CreateFail("1", true).ReturnsForAnyArgs(new Result());
        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        fanexMailApiService.WriteLog(EmailGroup.Csd, Arg.Any<Exception>());
    }

    [Fact]
    public void Send_HasMatchIsNull_HasWriteLog()
    {
        // Arrange
        var mailVoidViewModel = new MailVoidViewModel { Message = new Message { ContentEnglish = "SABA123" } };
        var sites = new List<SiteEmail> { new() { Site = "1", IsChinaView = true, ToList = "1;2;3" } };
        var tickets = new List<TicketEmailModel>
            { new() { EmailGroup = "1" }, new() { Currency = CurrencyConstant.UusId } };
        service = new EmailLicenseeServiceImp(null, fanexMailApiService, mailResultService, leagueNameMessageService);
        mailResultService.CreateFail("1", true).ReturnsForAnyArgs(new Result());
        // Act
        _ = service.Send(mailVoidViewModel, sites, tickets, true);

        // Assert
        fanexMailApiService.Received(1).WriteLog(EmailGroup.Csd, Arg.Any<Exception>());
    }
}