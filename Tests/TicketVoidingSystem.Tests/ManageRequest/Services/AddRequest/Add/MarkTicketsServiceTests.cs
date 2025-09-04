using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class MarkTicketsServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly OnlineServerRepository repository;
    private readonly MarkTicketsServiceImp service;
    private readonly SessionService sessionService;

    public MarkTicketsServiceTests()
    {
        repository = Substitute.For<OnlineServerRepository>();
        sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        service = new MarkTicketsServiceImp(repository, sessionService, loggingService);
    }

    [Fact]
    public async Task Execute_Successful_ReturnExpected()
    {
        // Arrange
        sessionService.GetClientIp().ReturnsForAnyArgs("127:00:42");
        sessionService.UserId.ReturnsForAnyArgs(1);
        var results = new List<Result> { new() };
        var transIds = new List<long>();
        repository.FetchMultipleAsync<Result, long>(Arg.Any<MarkTicketsCommand>(), Arg.Any<ExecutionMode>()).ReturnsForAnyArgs((results, transIds));
        var expected = new MarkTicketsResult
        {
            MarkedResults = results,
            MarkedTickets = transIds
        };

        // Act
        var actual = await service.MarkTicketsInTVS("0,1,2,3", 1, 1);

        sessionService.Received().GetClientIp();
        await repository.Received().FetchMultipleAsync<Result, long>(Arg.Any<MarkTicketsCommand>(), Arg.Any<ExecutionMode>());
        AssertExtension.Equal(expected, actual);
    }
}