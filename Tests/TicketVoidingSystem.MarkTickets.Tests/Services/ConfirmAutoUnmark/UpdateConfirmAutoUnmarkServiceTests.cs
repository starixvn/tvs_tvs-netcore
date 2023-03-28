using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.ConfirmAutoUnmark;

public class UpdateConfirmAutoUnmarkServiceTests : IClassFixture<RemotingRefFixture>
{
    [Fact]
    public async Task InsertAutoUnmarkSetting_RepositoryHasCalled()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var combineValidationService = Substitute.For<CombineValidationService>();
        var service = new UpdateConfirmAutoUnmarkServiceImp(repository, sessionService, combineValidationService);

        // Act
        await service.InsertAutoUnmarkSetting(new UpdateConfirmAutoUnmarkQuery());

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<InsertAutoUnmarkSettingCriteria>());
    }

    [Fact]
    public async Task GetTicketsAbnormalBetByMatchId_RepositoryHasCalled()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var combineValidationService = Substitute.For<CombineValidationService>();
        var service = new UpdateConfirmAutoUnmarkServiceImp(repository, sessionService, combineValidationService);

        // Act
        var actual = await service.GetTicketsAbnormalBetByMatchId(1);

        // Assert
        await repository.Received(1).FetchAsync<BetId>(Arg.Any<GetTicketsAbnormalBetCriteria>());
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task UpdateConfirmAutoUnmark_RepositoryHasCalled()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var combineValidationService = Substitute.For<CombineValidationService>();
        repository.FetchAsync<UpdateConfirmAutoUnmarkValidation>(default)
            .ReturnsForAnyArgs(new List<UpdateConfirmAutoUnmarkValidation>());
        combineValidationService.CombineUpdateResult(default)
            .ReturnsForAnyArgs(new UpdateConfirmAutoUnmarkValidation());
        var service = new UpdateConfirmAutoUnmarkServiceImp(repository, sessionService, combineValidationService);

        // Act
        var actual = await service.UpdateConfirmAutoUnmark(new UpdateConfirmAutoUnmarkQuery(), new List<BetId>());

        // Assert
        await repository.Received().FetchAsync<UpdateConfirmAutoUnmarkValidation>(Arg.Any<UpdateConfirmAutoUnmarkCriteria>());
        Assert.NotNull(actual);
    }
}