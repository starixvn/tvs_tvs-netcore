using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.DataCollection;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Services.SendDataOic;

public class CallApiAmendmentStageTests
{
    [Fact]
    public async Task CallApiAmendment_ValidQuery_AmendmentOicHasCalled()
    {
        // Arrange
        var expected = new AmendmentResponse
        {
            Code = 1,
            Message = ""
        };
        var licensee = new List<LicenseeFile>
        {
            new LicenseeFile{ LicenseeName = "LicenseeName", SessionID = "SessionID"}
        };
        var loggingService = Substitute.For<LoggingService>();
        var apiService = Substitute.For<AmendmentOicHttpClientService>();
        apiService.AmendmentOic(Arg.Any<AmendmentOicQuery>()).ReturnsForAnyArgs(expected);
        var service = new CallApiAmendmentStageImp(apiService, loggingService);

        // Act
        var actual = await service.Execute(licensee, "", new DateTime());

        // Assert
        await apiService.Received(1).AmendmentOic(Arg.Any<AmendmentOicQuery>());
        Assert.Equal(expected, actual);
    }
}