using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.Services.BetList;

public class BetListServiceTests
{
    private readonly IRemotingRefWrapperService remotingRefWrapperService;
    private BetListServiceImp service;

    public BetListServiceTests()
    {
        remotingRefWrapperService = Substitute.For<IRemotingRefWrapperService>();
        service = new BetListServiceImp(remotingRefWrapperService, null);
    }

    [Theory]
    [InlineData(123, 456, "ParentId", "Bet Type Name", "Bet Type Name")]  // Normal case
    [InlineData(85, 456, "ParentId", "Bet Type Name", "Next Bet Type Name")]  // First Next Bet
    [InlineData(86, 456, "ParentId", "Bet Type Name", "Next Bet Type Name")]  // Second Next Bet
    [InlineData(123, 456, null, "123", "123")]  // Null parent ID
    [InlineData(123, 456, "0", "123", "123")]  // Zero parent ID
    [InlineData(123, 456, "", "123", "123")]  // Empty parent ID
    public void GetDisplayedBetTypeName_ShouldReturnExpectedResult(
        int id,
        long refNo,
        string parentId,
        string betName,
        string expected)
    {
        // Arrange
        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns(parentId);
        remotingRefWrapperService.GetDisplayedBetTypeName(parentId ?? id.ToString(), refNo).Returns(betName);

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void GetDisplayedBetTypeName_WithNullParentId_ShouldUseIdAsString()
    {
        // Arrange
        const int id = 123;
        const long refNo = 456;
        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns((string)null);
        remotingRefWrapperService.GetDisplayedBetTypeName("123", refNo).Returns("123");

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal("123", result);
        remotingRefWrapperService.Received(1).GetDisplayedBetTypeName("123", refNo);
    }

    [Fact]
    public void GetDisplayedBetTypeName_WithEmptyParentId_ShouldUseIdAsString()
    {
        // Arrange
        const int id = 123;
        const long refNo = 456;
        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns(string.Empty);
        remotingRefWrapperService.GetDisplayedBetTypeName("123", refNo).Returns("123");

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal("123", result);
        remotingRefWrapperService.Received(1).GetDisplayedBetTypeName("123", refNo);
    }

    [Fact]
    public void GetDisplayedBetTypeName_WithZeroParentId_ShouldUseIdAsString()
    {
        // Arrange
        const int id = 123;
        const long refNo = 456;
        remotingRefWrapperService.GetParentIdByBetTypeId(id).Returns("0");
        remotingRefWrapperService.GetDisplayedBetTypeName("123", refNo).Returns("123");

        // Act
        var result = service.GetDisplayedBetTypeName(id, refNo);

        // Assert
        Assert.Equal("123", result);
        remotingRefWrapperService.Received(1).GetDisplayedBetTypeName("123", refNo);
    }
} 