using SpecialDelete.UploadBatchMessage.Controllers;
using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class ControllerExtensionTests
{
    [Fact]
    public void IsBitCoin_IdMatchesBitCoinOverUnder_ReturnTrue()
    {
        // Arrange
        var controller = new UploadBatchMessageController(null);

        // Act
        var actual = controller.JsonResultPascalCase(1);

        // Assert
        Assert.Equal(1, actual.Value);
    }
}