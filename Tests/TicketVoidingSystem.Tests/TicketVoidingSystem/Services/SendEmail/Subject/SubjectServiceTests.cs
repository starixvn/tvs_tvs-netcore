using System;
using System.Collections.Generic;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Subject;

public class SubjectServiceTests
{
    private readonly SubjectServiceImp service;

    public SubjectServiceTests()
    {
        service = new SubjectServiceImp();
    }

    [Theory]
    [InlineData(EmailGroup.Csd, "Voided Cash Out Transaction Report for 1 (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.CashOut, "Voided Cash Out Transaction Report for Cash Out (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.ItQa, "Test Currency - Voided Cash Out Transaction Report for  (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.ItSupport, "Real Currency - Voided Cash Out Transaction Report for  (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.Recover, "Exception Subject")]
    public void CreateVoid_ReturnChoice(EmailGroup group, string expected)
    {
        // Arrange
        var type = VoidType.CashOut;
        var mailViewModel = new MailViewModel { DateTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var tickets = new List<TicketEmailModel> { new() };
        var site = new SiteEmail { Site = "1" };

        // Act
        var actual = service.CreateVoid(mailViewModel, tickets, site, group, type);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(EmailGroup.Recover, "Recovered Cash Out Transaction Report (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.CashOut, "Recovered Cash Out Transaction Report (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.ItQa, "Test Currency - Recovered Cash Out Transaction Report (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.ItSupport, "Real Currency - Recovered Cash Out Transaction Report (2/2/2022 2:02:02 AM)")]
    [InlineData(EmailGroup.None, "Exception Subject")]
    public void CreateRecover_ReturnRecover(EmailGroup group, string expected)
    {
        // Arrange
        const RecoverType type = RecoverType.CashOut;
        var mailViewModel = new MailViewModel { DateTime = new DateTime(2022, 2, 2, 2, 2, 2) };

        // Act
        var actual = service.CreateRecover(mailViewModel, group, type);

        // Assert
        Assert.Equal(expected, actual);
    }
}