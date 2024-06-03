using System.Collections.Generic;
using System.Text.Json;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.WrongMarketOffered;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.WrongMarketOffered;

public class WrongMarketOfferedServiceTests
{
    private readonly BetTypesRepository repository;
    private readonly WrongMarketOfferedServiceImp service;

    public WrongMarketOfferedServiceTests()
    {
        repository = Substitute.For<BetTypesRepository>();
        service = new WrongMarketOfferedServiceImp(repository);
    }

    [Fact]
    public void GetBetTypesAdvancedMode_ValidRequest_ReturnListBetType()
    {
        // Arrange
        var models = new List<BetTeamAddRequestResult> { new() { Id = 1 }, new() { Id = 2 } };
        var json = JsonSerializer.Serialize(models);
        // Act
        var actual = service.GetBetTypesAdvancedMode(json);

        // Assert

        AssertExtension.Equal("", actual);
    }
}