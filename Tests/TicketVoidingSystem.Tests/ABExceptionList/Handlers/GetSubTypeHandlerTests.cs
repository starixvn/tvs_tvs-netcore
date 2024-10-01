using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ABExceptionList.Criteria;
using TicketVoidingSystem.ABExceptionList.Handlers;
using TicketVoidingSystem.ABExceptionList.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ABExceptionList.Handlers;

public class GetSubTypeHandlerTests
{
    [Fact]
    public async Task Handler_RepositoryHasCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetSubTypeCriteria();
        criteria.GetSettingKey();
        criteria.IsValid();
        var request = new GetSubTypeRequest();
        var subTypes = new List<AbExceptionSubTypeViewModel>
        {
            new() {SubIssueTypeIds = "27", SubIssueTypeName = "2"},
            new() {SubIssueTypeIds = "6", SubIssueTypeName = "6"}
        };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<AbExceptionSubTypeViewModel>(Arg.Any<GetSubTypeRequest>()).ReturnsForAnyArgs(subTypes);
        var handler = new GetSubTypeHandler(repository);

        // Act
        var actualResult = await handler.Handle(request, default);

        // Assert
        await repository.Received(1).FetchAsync<AbExceptionSubTypeViewModel>(request);
        Assert.Single(actualResult);
    }
}