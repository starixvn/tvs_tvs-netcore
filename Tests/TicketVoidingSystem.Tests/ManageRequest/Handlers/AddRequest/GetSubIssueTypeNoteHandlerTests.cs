using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest
{
    public class GetSubIssueTypeNoteHandlerTests
    {
        [Fact]
        public async Task Handle_ValidRequest_RepositoryHasCalled()
        {
            var subTypeNotes = new List<SubIssueTypeNoteModel> { new() };
            var request = new GetSubIssueTypeNoteRequest { IssueTypeId = 1 };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<SubIssueTypeNoteModel>(Arg.Any<GetSubIssueTypeNoteRequest>()).ReturnsForAnyArgs(subTypeNotes);
            var handler = new GetSubIssueTypeNoteHandler(repository);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            await repository.Received(1).FetchAsync<SubIssueTypeNoteModel>(Arg.Any<GetSubIssueTypeNoteRequest>());
            AssertExtension.Equal(subTypeNotes, actual);
        }
    }
}