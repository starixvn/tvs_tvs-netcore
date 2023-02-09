using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Services.SendDataOic;

public class CallApiAmendmentStageTests
{
    [Fact]
    public async Task CallApiAmendment_ValidQuery_AmendmentOicHasCalled()
    {
        // Arrange
        var expected = new AmendmentReponse
        {
            Code = 1,
            Message = ""
        };
        var licensee = new List<LicenseeFile>
        {
            new() { Name = "1", SessionID = "2" }
        };
        var loggingService = Substitute.For<LoggingService>();
        var apiService = Substitute.For<AmendmentOicHttpClientService>();
        apiService.AmendmentOic(Arg.Compat.Any<AmendmentOicQuery>()).ReturnsForAnyArgs(expected);
        var service = new CallApiAmendmentStageImp(apiService, loggingService);

        // Act
        var actual = await service.Execute(licensee, "", new DateTime());

        // Assert
        await apiService.Received(1).AmendmentOic(Arg.Compat.Any<AmendmentOicQuery>());
        Assert.Equal(expected, actual);
    }
}