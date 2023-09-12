using System;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail;

public class FanexMailApiServiceTests : AppSettingFixture
{
    private readonly LoggingService loggingService;
    private readonly FanexMailApiServiceImp service;

    public FanexMailApiServiceTests()
    {
        loggingService = Substitute.For<LoggingService>();
        service = new FanexMailApiServiceImp(loggingService);
    }

    [Fact]
    public async Task WriteLog_WithValidEmailGroup_CallsLoggingServiceErrorAsync()
    {
        // Arrange
        const EmailGroup group = EmailGroup.Csd;
        var exception = new Exception("Test exception");
        const string errorMessage = ErrorSendEmail.Csd;

        // Act
        await service.WriteLog(group, exception);

        // Assert
        await loggingService.Received(1).ErrorAsync(errorMessage, exception);
    }

    [Fact]
    public async Task WriteLog_WithEmailGroupIsCashOut_CallsLoggingServiceErrorAsyncWithDefaultErrorMessage()
    {
        // Arrange
        const EmailGroup group = new();
        var exception = new Exception("Test exception");
        const string defaultErrorMessage = ErrorSendEmail.WrongGroup;

        // Act
        await service.WriteLog(group, exception);

        // Assert
        await loggingService.Received(1).ErrorAsync(defaultErrorMessage, exception);
    }
}