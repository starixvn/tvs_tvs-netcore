using System;
using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class SystemTimeExtensionTests
{
    [Fact]
    public void ZoneManila_DateTimeIsNull_ReturnExpected()
    {
        // Arrange
        // Act
        var actual = ((DateTime?)null).ZoneManila();

        // Assert
        Assert.Null(actual);
    }

    [Fact]
    public void ZoneManila_DateTimeIsNotNull_ReturnExpected()
    {
        // Arrange
        DateTime? dateTime = new DateTime(2020, 12, 12, 12, 00, 00);
        DateTime? expected = new DateTime(2020, 12, 13, 00, 00, 00);

        // Act
        var actual = dateTime.ZoneManila();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void AddDays_HasDateTimeIsNull_ReturnNull()
    {
        // Arrange
        // Act
        var actual = ((DateTime?)null).AddDays(2);

        // Assert
        Assert.Null(actual);
    }
}