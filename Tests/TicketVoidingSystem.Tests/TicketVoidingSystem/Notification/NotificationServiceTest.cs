using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Criteria.Notification;
using TicketVoidingSystem.Models.Notification;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Notification;
using TicketVoidingSystem.SignalR;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Notification;

public class NotificationServiceTest
{
    private readonly SessionService sessionService = Substitute.For<SessionService>();
    private readonly IDynamicRepository repository = Substitute.For<IDynamicRepository>();
    private readonly NotificationSignalRService notificationSignalRService = Substitute.For<NotificationSignalRService>();
    private readonly NotificationServiceImp service;

    public NotificationServiceTest()
    {
        service = new NotificationServiceImp(repository, sessionService, notificationSignalRService);
    }

    [Fact]
    public async Task Get_ShouldReturnNotifications()
    {
        // Arrange
        const string username = "testUser";
        sessionService.UserName.Returns(username);
        var expectedNotifications = new List<NotificationModel>
        {
            new() { Id = 1, Username = username, Content = "Test Notification" }
        };
        repository.FetchAsync<NotificationModel>(Arg.Any<GetNotificationCriteria>())
            .Returns(expectedNotifications);

        // Act
        var result = await service.Get();

        // Assert
        Assert.Equal(expectedNotifications, result);
    }

    [Fact]
    public async Task UpdateNotification_ShouldCallRepositoryWithCorrectCriteria()
    {
        // Arrange
        const string idList = "1,2,3";
        const bool isRead = true;
        const string username = "testUser";
        sessionService.UserName.Returns(username);

        // Act
        await service.UpdateNotification(idList, isRead);

        // Assert
        await repository.Received(1).FetchMultipleAsync<NotificationModel, string>(
            Arg.Is<UpdateNotificationCriteria>(criteria =>
                criteria.IdList == idList &&
                criteria.IsRead == isRead &&
                criteria.Username == username));
    }

    [Fact]
    public async Task InsertUpdateRequest_ShouldPushNotificationsToTargetUsers()
    {
        // Arrange
        const string type = "TestType";
        const string content = "TestContent";
        const int requestId = 123;
        const string username = "testUser";
        sessionService.UserName.Returns(username);

        var notifications = new List<NotificationModel>
        {
            new() { Id = 1, Content = content, Type = type }
        };
        var targetUsers = new List<string> { "user1", "user2", username }; // Includes the current user
        repository.FetchMultipleAsync<NotificationModel, string>(Arg.Any<UpdateNotificationCriteria>())
            .Returns((notifications, targetUsers));

        // Act
        await service.InsertNotification(type, content, true, requestId);

        // Assert
        await notificationSignalRService.Received(1).PushNotification("user1", notifications[0]);
        await notificationSignalRService.Received(1).PushNotification("user2", notifications[0]);
        await notificationSignalRService.DidNotReceive().PushNotification(username, Arg.Any<NotificationModel>());
    }
}