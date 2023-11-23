using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.UploadBatchMessage.Criteria;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Repositories;
using SpecialDelete.UploadBatchMessage.Services;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.UploadBatchMessage.Services;


public class BatchMessageServiceTest
{
    private static BatchMessageServiceImp CreateService(UploadBatchMessageRepository repository)
    {
        var messageService = Substitute.For<SendMessageService>();
        var messageItemService = Substitute.For<MessageItemService>();
        var loggingService = Substitute.For<LoggingService>();
        return new BatchMessageServiceImp(
            repository,
            messageService,
            messageItemService,
            loggingService);
    }

    [Fact]
    public async Task GetReceiveUser_HasQueryModel_CreateCriteriaFromQuery()
    {
        // Arrange
        var query = new CheckTransIdsQueryModel
        {
            GroupName = "Group1",
            ProductIds = "1",
            TransIds = "123,456"
        };
        var repository = Substitute.For<UploadBatchMessageRepository>();
        var service = CreateService(repository);

        // Act
        await service.GetReceivedUsers(query);

        // Assert
        await repository.Received()
            .GetReceivedUsers(Arg.Is<GetReceivedUsersCriteria>(
                x => x.GroupName == query.GroupName &&
                     x.ProductIds == query.ProductIds &&
                     x.TransIds == query.TransIds));
    }

    private static BatchMessageServiceImp CreateService(
        SendMessageService messageService,
        MessageItemService messageItemService)
    {
        var repository = Substitute.For<UploadBatchMessageRepository>();
        var loggingService = Substitute.For<LoggingService>();
        return new BatchMessageServiceImp(
            repository,
            messageService,
            messageItemService,
            loggingService);
    }

    [Fact]
    public async Task UpdateMessage_SendMessageSuccessfully_ReturnResultSuccessfully()
    {
        // Arrange
        const int messageId = 12345;
        const string messageXml = "<Messages>Content</Messages>";
        var query = new UpdateMessageQueryModel { Message = new Message { CreatorId = 111 } };
        var messageService = Substitute.For<SendMessageService>();
        var messageItemService = Substitute.For<MessageItemService>();
        messageService.InsertMessage(Arg.Any<Message>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<bool>()).ReturnsForAnyArgs(messageId);
        messageItemService.CreateMessageItems(Arg.Any<IEnumerable<ReceivedUser>>(), Arg.Any<int>()).ReturnsForAnyArgs(messageXml);
        var service = CreateService(messageService, messageItemService);

        // Act
        var actual = await service.UpdateMessage(query);

        // Assert
        await messageService.Received(1).InsertBatchMessage(111, messageXml);
        Assert.Equal("Message has been uploaded successfully!", actual.ErrorMsg);
    }

    [Fact]
    public async Task UpdateMessage_SendMessageThrowException_WriteLogAndReturnResultFail()
    {
        // Arrange
        var exception = new Exception("Fail To Update Message");
        const string expectedMsg = "Fail To Update Message";
        var query = new UpdateMessageQueryModel();
        var repository = Substitute.For<UploadBatchMessageRepository>();
        var messageService = Substitute.For<SendMessageService>();
        var messageItemService = Substitute.For<MessageItemService>();
        messageItemService
            .When(x => x.CreateMessageItems(Arg.Any<IEnumerable<ReceivedUser>>(), Arg.Any<int>()))
            .Do(y => throw exception);
        var loggingService = Substitute.For<LoggingService>();
        var service = new BatchMessageServiceImp(
            repository,
            messageService,
            messageItemService,
            loggingService);

        // Act
        var actual = await service.UpdateMessage(query);

        // Assert
        await loggingService.Received().ErrorAsync(exception);
        Assert.Equal(expectedMsg, actual.ErrorMsg);
        Assert.Equal(1, actual.ErrorCode);
    }
}