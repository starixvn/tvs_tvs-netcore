using Fanex.Data.Repository;
using NSubstitute;
using System.Threading.Tasks;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.NetPosition;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.NetPosition
{
    public class NetPositionServiceTests
    {
        private readonly NetPositionHttpClientService netPositionHttpClientService;
        private readonly IDynamicRepository repository;
        private readonly NetPositionServiceImp service;

        public NetPositionServiceTests()
        {
            netPositionHttpClientService = Substitute.For<NetPositionHttpClientService>();
            var sessionService = Substitute.For<SessionService>();
            repository = Substitute.For<IDynamicRepository>();
            service = new NetPositionServiceImp(netPositionHttpClientService, sessionService, repository);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(1)]
        public async Task UpdateNetPosition_HasTransIds_HasCalledPostRequest(int errorCode)
        {
            // Arrange
            const string transIds = "12345";
            const string action = "update";
            
            netPositionHttpClientService.PostRequest(Arg.Any<string>(), Arg.Any<string>()).ReturnsForAnyArgs(new Result{ ErrorCode = errorCode, ErrorMsg = "123" });

            // Act
            _ = await service.UpdateNetPosition(transIds, action);

            // Assert
            await netPositionHttpClientService.Received(1).PostRequest(Arg.Any<string>(), Arg.Any<string>());         
        }

        [Fact]
        public async Task UpdateNetPosition_WithEmptyTransIds_ReturnsTrue()
        {
            // Arrange
            const string transIds = "";
            const string action = "update";

            // Act
            var result = await service.UpdateNetPosition(transIds, action);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task RollBackNetPosition_WithValidTransIds_CallsRepositoryExecuteAsync()
        {
            // Arrange
            const string transIds = "12345";
            const string action = "rollback";
            const string message = "Rollback message";
            
            // Act
            await service.RollBackNetPosition(transIds, action, message);

            // Assert
            await repository.Received(1).ExecuteAsync(Arg.Any<RollBackNetPositionCriteria>());
        }

    }
}
