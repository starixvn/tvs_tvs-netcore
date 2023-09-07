using System;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetLastTimeScoreHandlerTests : IClassFixture<AppSettingFixture>
{
    private readonly GetLastTimeScoreHandler handler;
    private readonly IDynamicRepository repository;

    public GetLastTimeScoreHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetLastTimeScoreHandler(repository);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new GetLastTimeScoreRequest
        {
            MatchId = 1, ActionId = 1, FilterBy = 1,
            ScoreId = 1, FilterFromTransTime = new DateTime(2022, 2, 2, 2, 2, 2)
        };
        repository.GetAsync<GetLastTimeScoreViewModel>(Arg.Any<GetLastTimeScoreCriteria>()).ReturnsForAnyArgs(
            new GetLastTimeScoreViewModel
                { LastTime = new DateTime(2022, 2, 2, 2, 2, 2) });

        var viewModel = new GetLastTimeScoreViewModel
        {
            ScoreId = request.ScoreId,
            LastTime = new DateTime(2022, 2, 2, 2, 2, 2)
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}