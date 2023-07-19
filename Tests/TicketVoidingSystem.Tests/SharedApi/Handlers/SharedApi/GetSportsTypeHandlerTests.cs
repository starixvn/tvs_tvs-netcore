using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using TicketVoidingSystem.SharedApi.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetSportsTypeHandlerTests
{
    private readonly GetSportsTypeHandler handler;
    private readonly IDynamicRepository repository;

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
        var expected = new List<SportInfo>();
        repository.FetchAsync<SportInfo>(new GetSportsTypeCriteria(), CancellationToken.None)
            .ReturnsForAnyArgs(expected);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual);
    }
}