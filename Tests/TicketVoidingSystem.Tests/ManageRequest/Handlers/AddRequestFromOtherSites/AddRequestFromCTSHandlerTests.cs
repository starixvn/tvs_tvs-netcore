using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequestFromOtherSites;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequestFromOtherSites;

public class AddRequestFromCTSHandlerTests
{
    private readonly AddRequestFromCTSHandler handler;

    public AddRequestFromCTSHandlerTests()
    {
        handler = new AddRequestFromCTSHandler();
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnJsonString()
    {
        // Arrange
        var request = new AddRequestFromCTSRequest
        {
            SubIssueTypeId = "27",
            ActionId = "5",
            IsTest = false,
            TransIds = "123,456,789"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result);

        var deserialized = JsonSerializer.Deserialize<AddRequestFromCTSModel>(result, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        Assert.NotNull(deserialized);
        Assert.Equal(IssueTypeConstant.AbnormalBet.ToString(), deserialized.IssueTypeId);
        Assert.Equal("27", deserialized.SubIssueTypeId);
        Assert.Equal("5", deserialized.ActionId);
        Assert.False(deserialized.IsTest);
        Assert.Equal("123,456,789", deserialized.TransIds);
    }

    [Fact]
    public async Task Handle_WithEmptyActionId_UseDefaultActionId()
    {
        // Arrange
        var request = new AddRequestFromCTSRequest
        {
            SubIssueTypeId = "32",
            ActionId = string.Empty,
            IsTest = true,
            TransIds = "111,222"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var deserialized = JsonSerializer.Deserialize<AddRequestFromCTSModel>(result, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        Assert.NotNull(deserialized);
        Assert.Equal(ActionVoidRequestConstant.AutoVoidWinningId.ToString(), deserialized.ActionId);
        Assert.Equal("32", deserialized.SubIssueTypeId);
        Assert.True(deserialized.IsTest);
        Assert.Equal("111,222", deserialized.TransIds);
    }

    [Fact]
    public async Task Handle_WithNullActionId_UseDefaultActionId()
    {
        // Arrange
        var request = new AddRequestFromCTSRequest
        {
            SubIssueTypeId = "27",
            ActionId = null,
            IsTest = false,
            TransIds = "999"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var deserialized = JsonSerializer.Deserialize<AddRequestFromCTSModel>(result, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        Assert.NotNull(deserialized);
        Assert.Equal(ActionVoidRequestConstant.AutoVoidWinningId.ToString(), deserialized.ActionId);
    }

    [Fact]
    public async Task Handle_WithWhitespaceActionId_UseDefaultActionId()
    {
        // Arrange
        var request = new AddRequestFromCTSRequest
        {
            SubIssueTypeId = "32",
            ActionId = "   ",
            IsTest = true,
            TransIds = "555"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var deserialized = JsonSerializer.Deserialize<AddRequestFromCTSModel>(result, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        Assert.NotNull(deserialized);
        Assert.Equal(ActionVoidRequestConstant.AutoVoidWinningId.ToString(), deserialized.ActionId);
    }

    [Fact]
    public async Task Handle_WithProvidedActionId_UseProvidedActionId()
    {
        // Arrange
        var request = new AddRequestFromCTSRequest
        {
            SubIssueTypeId = "27",
            ActionId = "10",
            IsTest = false,
            TransIds = "123"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var deserialized = JsonSerializer.Deserialize<AddRequestFromCTSModel>(result, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        Assert.NotNull(deserialized);
        Assert.Equal("10", deserialized.ActionId);
    }

    [Fact]
    public async Task Handle_AlwaysSetIssueTypeIdToAbnormalBet()
    {
        // Arrange
        var request = new AddRequestFromCTSRequest
        {
            SubIssueTypeId = "27",
            ActionId = "5",
            IsTest = false,
            TransIds = "123"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var deserialized = JsonSerializer.Deserialize<AddRequestFromCTSModel>(result, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        Assert.NotNull(deserialized);
        Assert.Equal(IssueTypeConstant.AbnormalBet.ToString(), deserialized.IssueTypeId);
    }

    [Fact]
    public async Task Handle_WithAllProperties_ReturnCompleteJson()
    {
        // Arrange
        var request = new AddRequestFromCTSRequest
        {
            SubIssueTypeId = "32",
            ActionId = "1",
            IsTest = true,
            TransIds = "100,200,300"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var deserialized = JsonSerializer.Deserialize<AddRequestFromCTSModel>(result, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        Assert.NotNull(deserialized);
        Assert.Equal(IssueTypeConstant.AbnormalBet.ToString(), deserialized.IssueTypeId);
        Assert.Equal("32", deserialized.SubIssueTypeId);
        Assert.Equal("1", deserialized.ActionId);
        Assert.True(deserialized.IsTest);
        Assert.Equal("100,200,300", deserialized.TransIds);
    }
}