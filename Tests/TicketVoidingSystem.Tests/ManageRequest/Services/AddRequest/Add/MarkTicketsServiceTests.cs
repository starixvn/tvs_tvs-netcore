using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class MarkTicketsServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly IDynamicRepository repository;
    private readonly MarkTicketsServiceImp service;
    private readonly SessionService sessionService;

    public MarkTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        service = new MarkTicketsServiceImp(repository, sessionService, loggingService);
    }

    [Fact]
    public async Task Execute_HasException_ReturnExpected()
    {
        // Arrange
        var e = new Exception();
        sessionService.GetClientIp().Throws(e);
        var expected = new MarkTicketsResult
        {
            MarkedResults = new List<Result> {
                new() { ErrorCode = 1, ErrorMsg = e.Message },
                new() { ErrorCode = 1, ErrorMsg = e.Message },
                new() { ErrorCode = 1, ErrorMsg = e.Message },
                new() { ErrorCode = 1, ErrorMsg = e.Message } },
            MarkedTickets = Enumerable.Empty<long>()
        };

        // Act
        var actual = await service.MarkTicketsInTVS("1", 1, 1);

        sessionService.Received(4).GetClientIp();
        await repository.Received(0).FetchMultipleAsync<Result, long>(Arg.Any<MarkTicketsCommand>());
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Execute_Successful_ReturnExpected()
    {
        // Arrange
        sessionService.GetClientIp().ReturnsForAnyArgs("127:00:42");
        sessionService.UserId.ReturnsForAnyArgs(1);
        var results = new List<Result> { new() };
        List<long> transIds = null;
        SiteDbGroupConstant.ServerList.ForEach(x =>
        {
            transIds = new List<long> { x.Id };
            repository.FetchMultipleAsync<Result, long>(Arg.Is<MarkTicketsCommand>(y => y.SiteDbGroupId == x.Id)).Returns((results, transIds));
        });
        var expected = new MarkTicketsResult
        {
            MarkedResults = new List<Result> { new(), new(), new(), new() },
            MarkedTickets = new List<long> { 0, 1, 2, 3 }
        };

        // Act
        var actual = await service.MarkTicketsInTVS("0,1,2,3", 1, 1);

        sessionService.Received(4).GetClientIp();
        await repository.Received(4).FetchMultipleAsync<Result, long>(Arg.Any<MarkTicketsCommand>());
        AssertExtension.Equal(expected, actual);
    }
}