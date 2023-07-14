using Fanex.Data.Repository;
using NSubstitute;
using System.Threading.Tasks;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Services.NetPosition;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.NetPosition
{
    public class NetPositionServiceTests
    {
        private readonly IDynamicRepository repository;
        private NetPositionServiceImp service;

        public NetPositionServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            service = new NetPositionServiceImp(repository);
        }

        [Fact]
        public async Task UpdateNetPosition_HasTransIds_HasCalledPostRequest()
        {
            // Arrange
            // Act
            var result = await service.UpdateNetPosition("123", "VOID");

            // Assert
            await repository.Received(1).ExecuteAsync(Arg.Any<TicketVoidingNetPositionCriteria>());
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateNetPosition_WithEmptyTransIds_ReturnsTrue()
        {
            // Arrange
            // Act
            var result = await service.UpdateNetPosition("", "VOID");

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateNetPosition_WithNullTransIds_ReturnsTrue()
        {
            // Arrange
            // Act
            var result = await service.UpdateNetPosition(null, "VOID");

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateNetPosition_HasException_ReturnsFalse()
        {
            // Arrange
            service = new NetPositionServiceImp(null);

            // Act
            var result = await service.UpdateNetPosition("1234", "VOID");

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task RollBackNetPosition_WithInValidTransIds_NotCalledRepositoryExecuteAsync()
        {
            // Arrange
            // Act
            await service.RollBackNetPosition("");

            // Assert
            await repository.Received(0).ExecuteAsync(Arg.Any<TicketVoidingNetPositionCriteria>());
        }

        [Fact]
        public async Task RollBackNetPosition_WithValidTransIds_CalledRepositoryExecuteAsync()
        {
            // Arrange
            // Act
            await service.RollBackNetPosition("1234");

            // Assert
            await repository.Received(1).ExecuteAsync(Arg.Any<TicketVoidingNetPositionCriteria>());
        }
    }
}
