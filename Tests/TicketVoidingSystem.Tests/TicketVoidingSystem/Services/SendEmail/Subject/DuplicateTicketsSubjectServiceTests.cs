using System.Collections.Generic;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Subject;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Subject;

public class DuplicateTicketsSubjectServiceTests
{
    [Theory]
    [InlineData(EmailGroup.Csd, "[0] - 复制注单作废 (@@11) | Duplicate Ticket Voided (@@22)")]
    [InlineData(EmailGroup.ItQa, "Test Currency - [0] - 复制注单作废 (@@11) | Duplicate Ticket Voided (@@22)")]
    [InlineData(EmailGroup.ItSupport, "Real Currency - [0] - 复制注单作废 (@@11) | Duplicate Ticket Voided (@@22)")]
    [InlineData(EmailGroup.CashOut, "Exception Subject")]
    public void Send_ValidData_CallExpected(EmailGroup group, string expected)
    {
        // Arrange
        var service = new DuplicateTicketsSubjectServiceImp();
        var mailViewModel = new DuplicateTicketsMailVoidViewModel
        { SportType = new TemplateContentModel { ContentChineseSimplified = "@@11", ContentEnglish = "@@22" } };
        var site = new SiteEmail { Site = "0" };
        var sites = new List<string> { "0" };

        // Act
        var actual = service.CreateVoidDuplicateTickets(mailViewModel, sites, site, group);

        // Assert
        Assert.Equal(expected, actual);
    }
}