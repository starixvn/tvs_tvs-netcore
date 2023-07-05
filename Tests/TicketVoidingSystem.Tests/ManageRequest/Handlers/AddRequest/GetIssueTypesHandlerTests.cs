using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest
{
    public class GetIssueTypesHandlerTests
    {
        [Fact]
        public async Task Handle_RepositoryHasCalled_ReturnViewModelExpected()
        {
            // Arrange
            var request = new GetIssueTypesRequest();
            var repository = Substitute.For<IDynamicRepository>();
            var issueTypes = new List<IssueType> { new IssueType() };
            var subIssueTypes = new List<SubIssueType> { new SubIssueType() };
            repository.FetchAsync<IssueType>(new GetIssueTypeCriteria(), CancellationToken.None).ReturnsForAnyArgs(issueTypes);
            repository.FetchAsync<SubIssueType>(new GetIssueTypeCriteria(), CancellationToken.None).ReturnsForAnyArgs(subIssueTypes);
            var expected = new IssueTypesViewModel
            {
                IssueTypes = issueTypes,
                SubIssueTypes = subIssueTypes
            };

            var handler = new GetIssueTypesHandler(repository);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            AssertExtension.Equal(expected, actual);
        }
    }
}