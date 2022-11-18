using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.ABExceptionList.Tests.Handlers
{
    public class RemoveUsersHandlerTests
    {
        [Fact()]
        public async Task Handler_RepositoryHasCalled_ReturnResult()
        {
            // Arrange
            var command = new RemoveUsersCommand();
            command.GetSettingKey();
            command.IsValid();
            var request = new RemoveUsersRequest();
            var expectedResult = new Result { ErrorCode = 0 };
            var repository = Substitute.For<IDynamicRepository>();
            var sessionService = Substitute.For<SessionService>();
            sessionService.UserId.Returns(1);
            sessionService.GetClientIp().Returns("1.1.1.1");
            repository.ExecuteAsync(Arg.Compat.Do<RemoveUsersCommand>(x =>
            {
                x.CustIds = request.CustIds;
                x.UserId = sessionService.UserId;
                x.IP = sessionService.GetClientIp();
            })).Returns(999);
            var handler = new RemoveUsersHandler(repository, sessionService);

            // Act
            var actualResult = await handler.Handle(request, default);

            // Assert
            Assert.Equal(expectedResult.ErrorCode, actualResult.ErrorCode);
            Assert.Equal(expectedResult.ErrorMsg, actualResult.ErrorMsg);
        }
    }
}