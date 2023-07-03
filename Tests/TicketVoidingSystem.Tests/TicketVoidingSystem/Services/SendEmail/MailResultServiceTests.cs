using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail
{
    public class MailResultServiceTests
    {
        private readonly MailResultServiceImp service;
        public MailResultServiceTests()
        {
            service = new MailResultServiceImp();
        }

        [Theory]
        [InlineData(true, ErrorCode.SendEmailToLicenseeSuccess)]
        [InlineData(false, 0)]
        public void CreateSuccess_ReturnsResult(bool isFromAfterVoidService, int errorCode)
        {
            // Arrange
            var siteName = "Test Site";
            var listEmail = new string[] { "email1@example.com", "email2@example.com" };
            var expected = new Result
            {
                ErrorCode = errorCode,
                ErrorMsg = string.Format(StringResource.VoidBetDetailsSendMailSuccess, siteName, string.Join("; ", listEmail))
            };
            // Act
            var result = service.CreateSuccess(siteName, listEmail, isFromAfterVoidService);

            // Assert
            AssertExtension.Equal(expected, result);
        }

        [Theory]
        [InlineData(true, ErrorCode.SendEmailToLicenseeFail)]
        [InlineData(false, ErrorCode.SendMessageOrEmailFail)]
        public void CreateFail_ReturnsResult(bool isFromAfterVoidService, int errorCode)
        {
            // Arrange
            var siteName = "Test Site";
            var listEmail = new string[] { "email1@example.com", "email2@example.com" };
            var expected = new Result
            {
                ErrorCode = errorCode,
                ErrorMsg = string.Format(StringResource.VoidBetDetailsSendMailFail, siteName)
            };
            // Act
            var result = service.CreateFail(siteName, isFromAfterVoidService);

            // Assert
            AssertExtension.Equal(expected, result);
        }


        [Fact]
        public void InsertCombineLicenseesName_ReturnsListResult()
        {
            // Arrange
            var siteNameSuccess = "siteNameSuccess";
            var siteNameFails = "siteNameFails";
            var results = new List<Result>();
            var expected = new List<Result>
            {
                new Result
                {
                    ErrorCode = 0,
                    ErrorMsg = StringResource.VoidBetSuccessfully
                },
                new Result
                {
                    ErrorCode = 0,
                    ErrorMsg = string.Format(StringResource.VoidBetSendMailSuccess, siteNameSuccess)
                },
                new Result
                {
                    ErrorCode = ErrorCode.SendMessageOrEmailFail,
                    ErrorMsg = string.Format(StringResource.VoidBetSendMailFail, siteNameFails)
                },
                new Result
                {
                    ErrorCode = ErrorCode.DivideMessageMailDetail,
                    ErrorMsg = StringResource.ForMoreDetails
                }
        };

            // Act
            var result = service.InsertCombineLicenseesName(results, siteNameSuccess, siteNameFails);

            // Assert
            AssertExtension.Equal(expected, result);
        }

        [Fact]
        public void InsertCombineLicenseesNameForAfterVoidService_ReturnsListResult()
        {
            // Arrange
            var siteNameSuccess = "siteNameSuccess";
            var siteNameFails = "siteNameFails";
            var results = new List<Result>();
            var expected = new List<Result>
            {
                new Result
                {
                    ErrorCode = ErrorCode.LicenseeSuccess,
                    ErrorMsg = string.Format(StringResource.VoidBetSendMailSuccess, siteNameSuccess),
                    Data = siteNameSuccess
                    },
                new Result
                {
                    ErrorCode = ErrorCode.LicenseeFail,
                    ErrorMsg = string.Format(StringResource.VoidBetSendMailFail, siteNameFails),
                    Data = siteNameFails
                }
        };

            // Act
            var result = service.InsertCombineLicenseesNameForAfterVoidService(results, siteNameSuccess, siteNameFails);

            // Assert
            AssertExtension.Equal(expected, result);
        }

        [Fact]
        public void InsertCombineLicenseesName_HasSiteNameSuccessAndSiteNameFailsIsEmpty_ReturnsExpectedResult()
        {
            // Arrange
            var siteNameSuccess = "";
            var siteNameFails = "";
            var results = new List<Result>();
            var expected = new List<Result>
            {
                new Result
                {
                    ErrorCode = 0,
                    ErrorMsg = StringResource.VoidBetSuccessfully
                },
                new Result
                {
                    ErrorCode = 0,
                    ErrorMsg = string.Empty
                },
                new Result
                {
                    ErrorCode = ErrorCode.SendMessageOrEmailFail,
                    ErrorMsg = string.Empty
                }
            };

            // Act
            var result = service.InsertCombineLicenseesName(results, siteNameSuccess, siteNameFails);

            // Assert
            AssertExtension.Equal(expected, result);
        }
    }
}
