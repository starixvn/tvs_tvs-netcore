using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class LogInfoExtensionTests
{
    [Fact]
    public void GetKickOffInfoXml_NoHasKickOffTime_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel>();

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetKickOffInfoXml_HasKickOffTime_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel>{ new(){ MatchId = 1} };

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal("<root><r MatchId='1' KickOffTime=''/></root>", result);
    }
}