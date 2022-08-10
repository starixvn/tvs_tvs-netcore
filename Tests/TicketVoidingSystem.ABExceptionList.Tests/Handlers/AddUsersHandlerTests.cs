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
    public class AddUsersHandlerTests
    {
        [Fact()]
        public async Task Handler_RepositoryHasCalled_ReturnResult()
        {
            // Arrange
            var request = new AddUsersRequest();
            var expectedResult = new Result();
            var repository = Substitute.For<IDynamicRepository>();
            var sessionService = Substitute.For<SessionService>();
            sessionService.UserId.Returns(1);
            sessionService.GetClientIp().Returns("1.1.1.1");
            repository.ExecuteAsync(Arg.Compat.Do<AddUsersCommand>(x =>
            {
                x.Usernames = request.Usernames;
                x.UserId = sessionService.UserId;
                x.IP = sessionService.GetClientIp();
            })).Returns(999);
            var handler = new AddUsersHandler(repository, sessionService);

            // Act
            var actualResult = await handler.Handle(request, default);

            // Assert
            Assert.Equal(expectedResult.ErrorCode, actualResult.ErrorCode);
            Assert.Equal(expectedResult.ErrorMsg, actualResult.ErrorMsg);
        }
    }
}