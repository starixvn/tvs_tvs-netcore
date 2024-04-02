using System;
using Fanex.MailDeliver.MailClient.Model;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendEmail.RecoverSpecialDeletePage;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services.RecoverTickets;

public class EmailServiceTest
{
    [Fact]
    public void SendEmail_ValidMailRecord_SendSuccessfullyEmail()
    {
        // Arrange
        var mailRecord = new MailRecord();
        var model = new MailRecoverModel<MailTicketViewModel, RecoverTicketModel>();
        const EmailGroup group = EmailGroup.None;
        const Recover typeOfRecover = Recover.None;
        var fanexMailApiService = Substitute.For<FanexMailApiService>();
        var emailRecordService = Substitute.For<EmailRecordService>();
        emailRecordService.Create(model, group, typeOfRecover).ReturnsForAnyArgs(mailRecord);
        var service = new EmailServiceImp(fanexMailApiService, emailRecordService);

        // Act
        service.SendEmail(model, group, typeOfRecover);

        // Assert
        fanexMailApiService.Received().SendEmail(mailRecord, Arg.Any<SiteEmail>());
    }

    [Fact]
    public void SendEmail_ThrowException_WriteLog()
    {
        // Arrange
        var exception = new Exception();
        var model = new MailRecoverModel<MailTicketViewModel, RecoverTicketModel>();
        const EmailGroup group = EmailGroup.None;
        const Recover typeOfRecover = Recover.None;
        var fanexMailApiService = Substitute.For<FanexMailApiService>();
        var emailRecordService = Substitute.For<EmailRecordService>();
        emailRecordService
            .When(x => x.Create(model, group, typeOfRecover))
            .Do(x => throw exception);
        var service = new EmailServiceImp(fanexMailApiService, emailRecordService);

        // Act
        service.SendEmail(model, group, typeOfRecover);

        // Assert
        fanexMailApiService.Received()
            .WriteLog(group, exception);
    }
}