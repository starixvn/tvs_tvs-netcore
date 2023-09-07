using System;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class ReCalculateTicketsServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly IDynamicRepository repository;
    private readonly ReCalculateTicketsServiceImp service;
    private readonly SessionService sessionService;

    public ReCalculateTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        service = new ReCalculateTicketsServiceImp(repository, sessionService, loggingService);
    }

    [Fact]
    public async Task Execute_ValidData_HasCalledExpected()
    {
        // Arrange
        sessionService.GetClientIp().ReturnsForAnyArgs("1");

        // Act
        _ = await service.Execute(1, "1");

        // Assert
        sessionService.Received(1).GetClientIp();
        await repository.Received(4).ExecuteAsync(Arg.Any<ReCalculateTicketCommand>());
    }

    [Fact]
    public async Task Execute_HasException_ReturnErrorCodeExpected()
    {
        // Arrange
        sessionService.GetClientIp().Throws(new Exception());

        // Act
        var actual = await service.Execute(1, "1");

        // Assert
        Assert.Equal(1, actual.First().ErrorCode);
    }
}