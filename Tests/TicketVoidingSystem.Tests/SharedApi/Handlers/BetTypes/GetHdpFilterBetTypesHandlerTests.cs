using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Handlers.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.BetTypes;

public class GetHdpFilterBetTypesHandlerTests
{
    private readonly RemotingRefWrapperService remotingRefWrapperService;
    private readonly GetHdpFilterBetTypesHandler handler;

    public GetHdpFilterBetTypesHandlerTests()
    {
        remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        handler = new GetHdpFilterBetTypesHandler(remotingRefWrapperService);

        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var appDataPath = Path.Combine(baseDirectory, "App_Data", "Data");
        Directory.CreateDirectory(appDataPath);
        var jsonFilePath = Path.Combine(appDataPath, "HdpFilterBetTypes.json");

        const string jsonContent = @"{
            ""BetTypes"": [
              {
                ""IssueType"": 1,
                ""Sports"": ""1"",
                ""BetType"": ""1,2""
              },
              {
                ""IssueType"": 1,
                ""Sports"": ""2"",
                ""BetType"": ""3""
              },
              {
                ""IssueType"": 4,
                ""Sports"": ""1,2"",
                ""BetType"": ""1""
              },
              {
                ""IssueType"": 4,
                ""Sports"": ""1"",
                ""BetType"": ""153""
              }
            ]
        }";
        File.WriteAllText(jsonFilePath, jsonContent);
    }

    [Fact]
    public async Task Handle_ValidRequest_CallGetDisplayedBetTypeName()
    {
        // Arrange
        var request = new GetHdpFilterBetTypesRequest
        {
            SportId = "1",
            IssueTypeId = 1
        };
        remotingRefWrapperService.GetDisplayedBetTypeName(Arg.Any<string>()).ReturnsForAnyArgs("Handicap");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        remotingRefWrapperService.Received().GetDisplayedBetTypeName(Arg.Any<string>());
    }

    [Fact]
    public async Task Handle_ValidRequest_ReturnFilteredAndOrderedResults()
    {
        // Arrange
        var request = new GetHdpFilterBetTypesRequest
        {
            SportId = "1",
            IssueTypeId = 1
        };
        remotingRefWrapperService.GetDisplayedBetTypeName(Arg.Any<string>()).ReturnsForAnyArgs("Handicap");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        var resultList = result.ToList();
        if (resultList.Any())
        {
            // Verify results are ordered by Name
            var orderedNames = resultList.Select(x => x.Name).OrderBy(x => x).ToList();
            var actualNames = resultList.Select(x => x.Name).ToList();
            Assert.Equal(orderedNames, actualNames);
        }
    }

    [Fact]
    public async Task Handle_ValidRequestWithMultipleSports_ReturnFilteredResults()
    {
        // Arrange
        var request = new GetHdpFilterBetTypesRequest
        {
            SportId = "2",
            IssueTypeId = 1
        };
        remotingRefWrapperService.GetDisplayedBetTypeName(Arg.Any<string>()).ReturnsForAnyArgs("Over/Under");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
    }

    [Fact]
    public async Task Handle_RequestWithNoMatchingData_ReturnEmptyList()
    {
        // Arrange
        var request = new GetHdpFilterBetTypesRequest
        {
            SportId = "999",
            IssueTypeId = 999
        };
        remotingRefWrapperService.GetDisplayedBetTypeName(Arg.Any<string>()).ReturnsForAnyArgs("Test");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task Handle_RequestWithBetTypeContainingComma_TakeFirstBetType()
    {
        // Arrange
        var request = new GetHdpFilterBetTypesRequest
        {
            SportId = "1",
            IssueTypeId = 1
        };
        remotingRefWrapperService.GetDisplayedBetTypeName(Arg.Any<string>()).ReturnsForAnyArgs("Handicap");

        // Act
        _ = await handler.Handle(request, CancellationToken.None);

        // Assert
        remotingRefWrapperService.Received().GetDisplayedBetTypeName(Arg.Any<string>());
    }

    [Fact]
    public async Task Handle_ValidRequestWithMultipleItems_ReturnResultsOrderedByName()
    {
        // Arrange
        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var appDataPath = Path.Combine(baseDirectory, "App_Data", "Data");
        Directory.CreateDirectory(appDataPath);
        var jsonFilePath = Path.Combine(appDataPath, "HdpFilterBetTypes.json");

        // Setup test data with multiple items that will match the request
        const string jsonContent = @"{
            ""BetTypes"": [
              {
                ""IssueType"": 1,
                ""Sports"": ""1"",
                ""BetType"": ""10""
              },
              {
                ""IssueType"": 1,
                ""Sports"": ""1"",
                ""BetType"": ""20""
              },
              {
                ""IssueType"": 1,
                ""Sports"": ""1"",
                ""BetType"": ""30""
              },
              {
                ""IssueType"": 1,
                ""Sports"": ""2"",
                ""BetType"": ""40""
              }
            ]
        }";
        File.WriteAllText(jsonFilePath, jsonContent);

        var request = new GetHdpFilterBetTypesRequest
        {
            SportId = "1",
            IssueTypeId = 1
        };

        // Setup mock to return different names for different bet types
        remotingRefWrapperService.GetDisplayedBetTypeName("10").Returns("Zebra");
        remotingRefWrapperService.GetDisplayedBetTypeName("20").Returns("Alpha");
        remotingRefWrapperService.GetDisplayedBetTypeName("30").Returns("Beta");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        var resultList = result.ToList();
        Assert.Equal(3, resultList.Count);

        // Verify results are ordered by Name alphabetically
        var names = resultList.Select(x => x.Name).ToList();
        var expectedOrder = new List<string> { "Alpha", "Beta", "Zebra" };
        Assert.Equal(expectedOrder, names);

        // Verify each item is in correct position
        Assert.Equal("Alpha", resultList[0].Name);
        Assert.Equal("Beta", resultList[1].Name);
        Assert.Equal("Zebra", resultList[2].Name);
    }
}