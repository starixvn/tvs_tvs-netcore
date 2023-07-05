using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.BetList.Core.Builder;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.Templates;
using Fanex.BetList.Core.TicketHelper;
using Fanex.Logging;
using Fanex.Logging.Extensions;
using FizzWare.NBuilder;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services
{
    public class LoggingServiceTests
    {
        private readonly LoggingServiceImp service;

        public LoggingServiceTests()
        {
            service = new LoggingServiceImp();
        }

        //[Fact]
        //public async Task ErrorAsync_WithMessageAndException_CallsLogServiceWithErrorAsync()
        //{
        //    // Arrange
        //    string message = "Test error message";
        //    var exception = new Exception("Test exception");
        //    // Act
        //    await service.ErrorAsync(message, exception);

        //    // Assert
        //    _ = LogService.ErrorAsync(Arg.Any<string>());
        //}

        //[Fact]
        //public async Task ErrorAsync_WithMessage_CallsLogServiceWithErrorAsync()
        //{
        //    // Arrange
        //    string message = "Test error message";

        //    // Act
        //    await loggingService.ErrorAsync(message);

        //    // Assert
        //    await logService.Received(1).ErrorAsync(message);
        //}

        //[Fact]
        //public async Task ErrorAsync_WithException_CallsLogServiceWithErrorAsync()
        //{
        //    // Arrange
        //    var exception = new Exception("Test exception");

        //    // Act
        //    await loggingService.ErrorAsync(exception);

        //    // Assert
        //    await logService.Received(1).ErrorAsync(exception);
        //}

        //[Fact]
        //public async Task InfoAsync_CallsLogServiceWithInfoAsync()
        //{
        //    // Arrange
        //    string message = "Test info message";

        //    // Act
        //    await loggingService.InfoAsync(message);

        //    // Assert
        //    await logService.Received(1).InfoAsync(message);
        //}

        //[Fact]
        //public async Task HandleException_CallsLogServiceWithErrorAsync()
        //{
        //    // Arrange
        //    var context = Substitute.For<HttpContext>();
        //    var exception = new Exception("Test exception");

        //    // Act
        //    await loggingService.HandleException(context, exception);

        //    // Assert
        //    await logService.Received(1).ErrorAsync(Arg.Any<string>());
        //}

        //[Fact]
        //public async Task HandleException_WithInnerException_CallsLogServiceWithErrorAsync()
        //{
        //    // Arrange
        //    var context = Substitute.For<HttpContext>();
        //    var exception = new Exception("Test exception", new Exception("Inner exception"));

        //    // Act
        //    await loggingService.HandleException(context, exception);

        //    // Assert
        //    await logService.Received(1).ErrorAsync(Arg.Any<string>());
        //}

        //[Fact]
        //public async Task HandleException_WithNullContext_CallsLogServiceWithErrorAsync()
        //{
        //    // Arrange
        //    var exception = new Exception("Test exception");

        //    // Act
        //    await loggingService.HandleException(null, exception);

        //    // Assert
        //    await logService.Received(1).ErrorAsync(Arg.Any<string>());
        //}

    }
}
