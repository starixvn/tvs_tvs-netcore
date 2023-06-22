using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SubParlayTicket;

public class GetSelectionsSMPHandlerTests
{
    private readonly IDynamicRepository repository;
    private readonly GetSelectionsSMPHandler handler;

    public GetSelectionsSMPHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetSelectionsSMPHandler(repository);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetSelectionsSMPRequest();
        var selections = new List<SelectionsSMP> { };
        repository.FetchAsync<SelectionsSMP>(request, CancellationToken.None).ReturnsForAnyArgs(selections);
        var expected = $"<div class=\"smp-group-selections\"></div>";

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected,  actual);
    }
}