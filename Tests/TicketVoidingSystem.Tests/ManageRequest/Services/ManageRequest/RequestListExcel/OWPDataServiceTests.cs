using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;

public class OWPDataServiceTests
{
    public IDynamicRepository repository;
    public LoggingService loggingService;
    public OWPDataServiceImp service;

    [Fact]
    public async Task GetIPTV_Success_ReturnExpected()
    {
        // Arrange
        var requests = new List<RequestModel> { new() { MatchId  = 864523, ParentMatchId  = 857365, EventDateMatch  = DateTimeOffset.Now.DateTime},
            new() { MatchId = 29 }, new() { MatchId = 864521} };
        var expected = new List<OWPData> { new() };
        repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<OWPData>(Arg.Any<GetIPTVFromOWPCriteria>()).Returns(expected);
        service = new OWPDataServiceImp(repository, null);

        // Act
        var result = await service.GetIPTVForRequests(requests);

        // Assert
        AssertExtension.Equal(expected, result);
    }

    [Fact]
    public async Task GetIPTV_NotSuccess_ReturnEmpty()
    {
        // Arrange
        var requests = new List<RequestModel> { new() { MatchId  = 864523, ParentMatchId  = 857365, EventDateMatch  = DateTimeOffset.Now.DateTime},
            new() { MatchId = 29 }, new() { MatchId = 864521} };
        loggingService = Substitute.For<LoggingService>();
        service = new OWPDataServiceImp(null, loggingService);

        // Act
        var result = await service.GetIPTVForRequests(requests);

        // Assert
        Assert.Empty(result);
    }
}