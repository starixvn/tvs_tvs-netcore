using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.Extensions;

public class BetListExtensionTests
{
    [Theory]
    //[InlineData(2, 0, 0)]
    [InlineData(2, null, 0)]
    // [InlineData(1, 0, 1)]
    [InlineData(1, null, 1)]
    // [InlineData(0, 0, 0)]
    [InlineData(0, null, 0)]
    public void SetWalletType_ReturnsExpectedValue(byte walletType, long? refCode, byte expected)
    {
        // Arrange

        // Act
        var result = walletType.SetWalletType(refCode);

        // Assert
        Assert.Equal(expected, result);
    }
}