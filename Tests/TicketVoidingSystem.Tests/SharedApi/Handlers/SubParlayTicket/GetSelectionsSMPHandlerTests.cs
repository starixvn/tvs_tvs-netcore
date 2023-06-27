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

    [Fact]
    public async Task Handle_MultipleSelections_ResultHasValue()
    {
        // Arrange
        var request = new GetSelectionsSMPRequest();
        var selections = new List<SelectionsSMP> { new SelectionsSMP { Result = "", SelectionName = "11"}, new SelectionsSMP { Result = "1", SelectionName = "11" } };
        repository.FetchAsync<SelectionsSMP>(request, CancellationToken.None).ReturnsForAnyArgs(selections);
        var result = "<div><span class=\"selection-smp\">11</span></div><div><span class=\"selection-smp\">11</span> - <span class=\"selection-result\">1</span></div>";
        var expected = $"<div class=\"smp-group-selections\">{result}</div>";

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expected, actual);
    }
}