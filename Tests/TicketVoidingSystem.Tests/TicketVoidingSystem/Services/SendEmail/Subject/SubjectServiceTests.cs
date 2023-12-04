using System;
using System.Collections.Generic;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Subject;

public class SubjectServiceTests
{
    private readonly SubjectServiceImp service = new();

    [Theory]
    [InlineData(EmailGroup.Csd, "Voided Cash Out Transaction Report for 2 (02/02/2022 02:02:02)")]
    [InlineData(EmailGroup.ItQa, "Test Currency - Voided Cash Out Transaction Report for 1, 2 (02/02/2022 02:02:02)")]
    [InlineData(EmailGroup.ItSupport,
        "Real Currency - Voided Cash Out Transaction Report for 1, 2 (02/02/2022 02:02:02)")]
    [InlineData(EmailGroup.CashOut, "Voided Cash Out Transaction Report for Cash Out (02/02/2022 02:02:02)")]
    [InlineData(EmailGroup.Recover, "Exception Subject")]
    public void CreateVoid_ReturnExpected(EmailGroup group, string expected)
    {
        // Arrange
        var mailViewModel = new MailViewModel { DateTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var sites = new List<string> { "1", "2" };
        var site = new SiteEmail
        {
            Site = "2"
        };
        const VoidType type = VoidType.CashOut;

        // Act
        var actual = service.CreateVoid(mailViewModel, sites, site, group, type);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(EmailGroup.Recover, "Recovered Cash Out Transaction Report (02/02/2023 02:02:02)")]
    [InlineData(EmailGroup.CashOut, "Recovered Cash Out Transaction Report (02/02/2023 02:02:02)")]
    [InlineData(EmailGroup.ItQa, "Test Currency - Recovered Cash Out Transaction Report (02/02/2023 02:02:02)")]
    [InlineData(EmailGroup.ItSupport, "Real Currency - Recovered Cash Out Transaction Report (02/02/2023 02:02:02)")]
    [InlineData(EmailGroup.Csd, "Exception Subject")]
    public void CreateRecover_ReturnExpected(EmailGroup group, string expected)
    {
        // Arrange
        var model = new MailRecoverModel<MailTicketViewModel, RecoverTicketModel>
        {
            ViewModel = new MailRecoverViewModel<MailTicketViewModel>
            { DateTime = new DateTime(2023, 2, 2, 2, 2, 2) }
        };

        // Act
        var actual = service.CreateRecover(model, group, RecoverType.CashOut);

        // Assert
        Assert.Equal(expected, actual);
    }
}