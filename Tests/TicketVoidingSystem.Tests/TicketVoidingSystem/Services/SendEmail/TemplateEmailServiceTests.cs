using System.Collections.Generic;
using System.Security.Policy;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail
{
    public class TemplateEmailServiceTests
    {
        private readonly TemplateEmailServiceImp service;

        public TemplateEmailServiceTests()
        {
            service = new TemplateEmailServiceImp();
        }

        //[Fact]
        //public void Create_HasValidData_ReturnMailRecordResult()
        //{
        //    // Arrange
        //    var mailVoidViewModel = new MailVoidViewModel { TemplateEmailPath.VoidBetChinese };
        //    var site = new SiteEmail { };
        //    var tickets = new List<TicketEmailViewModel> { new TicketEmailViewModel { } };
        //    var subject = "subject";
        //    var expected = new MailRecordResult
        //    {
        //        SiteEmail = site,
        //        Subject = subject,
        //        EmailBody = ""
        //    };

        //    // Act
        //    var actual = service.Create(mailVoidViewModel, tickets, site, subject);

        //    // Assert
        //    AssertExtension.Equal(expected, actual);
        //}
    }
}
