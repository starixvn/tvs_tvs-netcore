using Xunit;
using NSubstitute;
using TicketVoidingSystem.Constants;
using Fanex.LetstalkService.Client;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;
using Fanex.LetstalkService.Core.Models;
using System.Threading.Tasks;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk
{
    public class LetstalkSingleMessageServiceTests
    {
        private readonly LetstalkClientService letstalkService;
        private readonly LoggingService loggingService;
        private LetstalkSingleMessageServiceImp service;

        public LetstalkSingleMessageServiceTests()
        {
            letstalkService = Substitute.For<LetstalkClientService>();
            loggingService = Substitute.For<LoggingService>();
            service = new LetstalkSingleMessageServiceImp(letstalkService, loggingService);
        }

        [Fact]
        public async Task Send_SendMessageReturnsTrue_ReturnSuccessResult()
        {
            // Arrange
            var model = new LetstalkModel();
            var attachment = new LetstalkAttachment { };
            letstalkService.SendMessage(Arg.Any<LetstalkModel>()).Returns(true);

            // Act
            var result = await service.Send(model, attachment);

            // Assert
            AssertExtension.Equal(new Models.Result(), result);             
        }

        [Fact]
        public async Task Send_SendMessageReturnsFalse_ReturnErrorResult()
        {
            // Arrange
            var model = new LetstalkModel();
            var attachment = new LetstalkAttachment();
            letstalkService.SendMessage(Arg.Any<LetstalkModel>()).Returns(false);

            // Act
            var result = await service.Send(model, attachment);

            // Assert
            AssertExtension.Equal(ErrorCode.SendLetstalkFail, result.ErrorCode);
        }

        [Fact]
        public async Task Send_HasNotCanSendMessage_ReturnErrorResult()
        {
            // Arrange
            var model = new LetstalkModel();
            var attachment = new LetstalkAttachment();
            letstalkService.SendMessage(Arg.Any<LetstalkModel>()).Returns(false);
            service = new LetstalkSingleMessageServiceImp(null, loggingService);

            // Act
            var result = await service.Send(model, attachment);

            // Assert
            AssertExtension.Equal(ErrorCode.SendLetstalkFail, result.ErrorCode);
        }

        [Fact]
        public async Task Send_LetstalkAttachmentHasFileNameAndBytes_ReturnHasLetstalkAttachments()
        {
            // Arrange
            var model = new LetstalkModel();
            var attachment = new LetstalkAttachment { FileName = "FileName", Bytes = new byte[1] };
            letstalkService.SendMessage(Arg.Any<LetstalkModel>()).Returns(true);

            // Act
            var result = await service.Send(model, attachment);

            // Assert
            AssertExtension.Equal(new Models.Result(), result);
        }

        [Fact]
        public async Task Send_LetstalkAttachmentHasNotFileName_ReturnHasLetstalkAttachments()
        {
            // Arrange
            var model = new LetstalkModel();
            var attachment = new LetstalkAttachment { Bytes = new byte[1] };
            letstalkService.SendMessage(Arg.Any<LetstalkModel>()).Returns(true);

            // Act
            var result = await service.Send(model, attachment);

            // Assert
            AssertExtension.Equal(new Models.Result(), result);
        }
    }
}
