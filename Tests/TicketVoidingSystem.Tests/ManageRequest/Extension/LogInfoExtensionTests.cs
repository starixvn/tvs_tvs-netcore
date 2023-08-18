using TicketVoidingSystem.ManageRequest.Extension;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class LogInfoExtensionTests
{
    [Fact]
    public void GetKickOffInfoXml_NoHasKickOffTime_ReturnExpected()
    {
        // Arrange
        var expected = "<root><r MatchId='' KickOffTime=''/></root>";

        // Act
        var result = LogInfoExtension.GetKickOffInfoXml(null, null);

        // Assert
        Assert.Equal(expected, result);
    }
}