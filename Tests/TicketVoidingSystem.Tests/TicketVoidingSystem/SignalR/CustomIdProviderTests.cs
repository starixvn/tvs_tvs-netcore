using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NSubstitute;
using TicketVoidingSystem.SignalR;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.SignalR;

public class CustomIdProviderTests
{
    [Fact]
    public void GetUserId_HasConnection_ReturnName()
    {
        // Arrange
        var connectionContext = Substitute.For<ConnectionContext>();
        var contextOptions = Substitute.For<HubConnectionContextOptions>();
        var loggerFactory = Substitute.For<ILoggerFactory>();
        var connection = new HubConnectionContext(connectionContext, contextOptions, loggerFactory);
        var provider = new CustomIdProvider();

        // Act
        var actual = provider.GetUserId(connection);

        // Assert
        Assert.Equal("", actual);
    }
}