using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Fanex.Data.Repository;
using System.Collections.Generic;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.ViewModels;
using System.Linq;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.SharedApi;

public class GetIssueTypesHandlerTests
{
    private readonly IDynamicRepository repository;
    private readonly GetIssueTypesHandler handler;

    public GetIssueTypesHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetIssueTypesHandler(repository);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetIssueTypesRequest();
        var issueTypes = new List<IssueType> { };
        var subIssueTypes = new List<SubIssueType> { };
        repository.FetchAsync<IssueType>(new GetIssueTypeCriteria(), CancellationToken.None).ReturnsForAnyArgs(issueTypes);
        repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria(), CancellationToken.None).ReturnsForAnyArgs(subIssueTypes);
        var expected = new IssueTypesViewModel
        {
            IssueTypes = issueTypes,
            SubIssueTypes = subIssueTypes
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected.IssueTypes.ToList().Count(), actual.IssueTypes.ToList().Count());
        Assert.Equal(expected.SubIssueTypes.ToList().Count(), actual.SubIssueTypes.ToList().Count());

    }
}