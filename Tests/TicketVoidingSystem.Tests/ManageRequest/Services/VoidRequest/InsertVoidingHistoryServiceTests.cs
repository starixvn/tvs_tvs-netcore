using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class InsertVoidingHistoryServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly InsertVoidingHistoryServiceImp service;

    public InsertVoidingHistoryServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        service = new InsertVoidingHistoryServiceImp(repository, sessionService, loggingService);
    }

    [Fact]
    public async Task InsertVoidingHistory_ShouldInsertVoidingHistoryAndReturnId()
    {
        // Arrange
        var query = new InsertQueueQuery { RequestId = 1, Message = new Message() };
        var voidingHistoryModel = new VoidingHistoryModel { VoidingHistoryId = 10 };
        repository.GetAsync<VoidingHistoryModel>(Arg.Any<InsertVoidingHistoryCriteria>())
            .ReturnsForAnyArgs(voidingHistoryModel);

        // Act
        var result = await service.InsertVoidingHistory(query, 1, "123", "11");

        // Assert
        await repository.Received()
            .GetAsync<VoidingHistoryModel>(Arg.Any<InsertVoidingHistoryCriteria>());
        Assert.Equal(10, result);
    }
}