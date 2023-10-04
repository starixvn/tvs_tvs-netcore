using System;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest
{
    public class SaveSubIssueTypeNoteHandlerTests
    {
        [Fact]
        public async Task Handle_ValidRequest_RepositoryHasCalled()
        {
            var request = new SaveSubIssueTypeNoteRequest { IssueTypeId = 1 };
            var repository = Substitute.For<IDynamicRepository>();
            var loggingService = Substitute.For<LoggingService>();
            repository.ExecuteAsync(Arg.Any<SaveSubIssueTypeNoteRequest>(), Arg.Any<CancellationToken>()).ReturnsForAnyArgs(1);
            var handler = new SaveSubIssueTypeNoteHandler(repository, loggingService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            await repository.Received(1).ExecuteAsync(Arg.Any<SaveSubIssueTypeNoteCommand>(), Arg.Any<CancellationToken>());
            Assert.True(actual.IsSuccessful);
        }

        [Fact]
        public async Task Handle_HasException_ReturnError()
        {
            var exception = new Exception("Error");
            var request = new SaveSubIssueTypeNoteRequest { IssueTypeId = 1 };
            var repository = Substitute.For<IDynamicRepository>();
            var loggingService = Substitute.For<LoggingService>();
            repository.When(x => x.ExecuteAsync(Arg.Any<SaveSubIssueTypeNoteRequest>(), Arg.Any<CancellationToken>())).Throw(_ => exception);
            var handler = new SaveSubIssueTypeNoteHandler(repository, loggingService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.False(actual.IsSuccessful);
        }
    }
}