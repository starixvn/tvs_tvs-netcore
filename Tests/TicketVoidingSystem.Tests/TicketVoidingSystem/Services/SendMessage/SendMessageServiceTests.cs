using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Criteria.SendMessage;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendMessage;

public class SendMessageServiceTests
{
    private readonly MessageItemService messageItemService;
    private readonly IDynamicRepository repository;
    private readonly SendMessageServiceImp service;

    public SendMessageServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        messageItemService = Substitute.For<MessageItemService>();
        service = new SendMessageServiceImp(repository, messageItemService);
    }

    [Fact]
    public async Task InsertMessageIdForBatchMessage_ValidData_RepositoryHasCalledGetAsync()
    {
        // Arrange
        repository.GetAsync<int>(Arg.Any<CreateMessageCriteria>()).ReturnsForAnyArgs(1);

        // Act
        var actual = await service.InsertMessageIdForBatchMessage(new Message(), 1, 1);

        // Assert
        Assert.Equal(1, actual);
        await repository.Received(1).GetAsync<int>(Arg.Any<CreateMessageCriteria>());
    }

    [Fact]
    public async Task RemoveMessage_ValidData_RepositoryHasCalledExecuteAsync()
    {
        // Arrange
        // Act
        await service.RemoveMessage(1, "1");

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<RemoveMessageCommand>());
    }

    [Fact]
    public async Task DeleteTransaction_ValidData_RepositoryHasCalledExecuteAsync()
    {
        // Arrange
        // Act
        await service.DeleteTransaction(new List<BetId>());

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<DeleteVoidedTransactionCommand>());
    }

    [Fact]
    public async Task InsertMessage_ValidData_RepositoryHasCalledGetAsync()
    {
        // Arrange
        var message = new Message();
        const int matchId = 1;
        const int leagueGroupId = 1;
        const bool isLikelyAbnormalBet = true;
        repository.GetAsync<int>(Arg.Any<CreateMessageCriteria>()).ReturnsForAnyArgs(1);

        // Act
        var actual = await service.InsertMessage(message, matchId, leagueGroupId, isLikelyAbnormalBet);

        // Assert
        Assert.Equal(1, actual);
        await repository.Received(1).GetAsync<int>(Arg.Any<CreateMessageCriteria>());
    }

    [Fact]
    public void InsertReason_ValidData_RepositoryHasCalledExecuteAsync()
    {
        // Arrange
        const string reasonEnglish = "reasonEnglish";
        const string reasonChineseSimplified = "reasonChineseSimplified";
        repository.ExecuteAsync(Arg.Any<InsertReasonCommand>()).ReturnsForAnyArgs(1);

        // Act
        _ = service.InsertReason(reasonEnglish, reasonChineseSimplified);

        // Assert
        repository.Received(1).ExecuteAsync(Arg.Any<InsertReasonCommand>());
    }

    [Theory]
    [InlineData(11)]
    [InlineData(1)]
    public void SendMessage_ValidData_HasCreateMessageItems(int issueTypeId)
    {
        // Arrange
        var tickets = new List<TicketEmailModel> { new() { Site = "cn88" } };
        const int messageId = 1;
        const int creatorId = 1;
        messageItemService.CreateMessageItems(Arg.Any<IEnumerable<ReceivedUser>>(), default)
            .ReturnsForAnyArgs("messageXml");
        repository.ExecuteAsync(Arg.Any<SendMessageCommand>()).ReturnsForAnyArgs(1);

        // Act
        _ = service.SendMessage(tickets, messageId, issueTypeId, creatorId);

        // Assert
        messageItemService.Received(1).CreateMessageItems(Arg.Any<IEnumerable<ReceivedUser>>(), messageId);
        repository.Received(1).ExecuteAsync(Arg.Any<SendMessageCommand>());
    }

    [Fact]
    public void InsertMessageIntoAdminSite_ValidData_RepositoryCalledExecuteAsync()
    {
        // Arrange
        var message = new Message();
        repository.ExecuteAsync(Arg.Any<InsertMessageIntoAdminSiteCriteria>()).ReturnsForAnyArgs(1);

        // Act
        _ = service.InsertMessageIntoAdminSite(message);

        // Assert
        repository.Received(1).ExecuteAsync(Arg.Any<InsertMessageIntoAdminSiteCriteria>());
    }

    [Fact]
    public void InsertVoidedTransaction_ValidData_RepositoryCalledExecuteAsync()
    {
        // Arrange
        var tickets = new List<TicketEmailModel> { new() { TransId = 1, CustId = 1, MatchId = 1 } };
        repository.ExecuteAsync(Arg.Any<InsertVoidedTransactionCommand>()).ReturnsForAnyArgs(1);

        // Act
        _ = service.InsertVoidedTransaction(tickets, 1, 1, 1, 1);

        // Assert
        repository.Received(1).ExecuteAsync(Arg.Any<InsertVoidedTransactionCommand>());
    }
}