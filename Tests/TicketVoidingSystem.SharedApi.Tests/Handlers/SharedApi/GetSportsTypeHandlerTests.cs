using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Fanex.Data.Repository;
using System.Collections.Generic;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models;

namespace TicketVoidingSystem.SharedApi.Tests.Handlers.SharedApi;

public class GetSportsTypeHandlerTests
{
    private readonly IDynamicRepository repository;
    private readonly GetSportsTypeHandler handler;

    public GetSportsTypeHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetSportsTypeHandler(repository);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetSportsTypeRequest();
        var expected = new List<SportInfo> { };
        repository.FetchAsync<SportInfo>(new GetSportsTypeCriteria(), CancellationToken.None).ReturnsForAnyArgs(expected);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual);
    }
}