using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.ConfirmAutoUnmark;

public class ConfirmAutoUnmarkServiceTests
{
    [Fact]
    public async Task GetDataForConfirmAutoUnmark_RepositoryHasCalled()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        repository.GetAsync<string>(default)
            .ReturnsForAnyArgs("");
        repository.FetchAsync<ConfirmAutoUnmarkModel>(default)
            .ReturnsForAnyArgs(new List<ConfirmAutoUnmarkModel>());

        var service = new ConfirmAutoUnmarkServiceImp(repository);

        // Act
        var actual = await service.GetDataForConfirmAutoUnmark(new GetDataForConfirmAutoUnmarkQuery());

        // Assert
        
        await repository.Received().GetAsync<string>(Arg.Any<GetTransInfoForAutoUnmarkCriteria>());
        await repository.Received().FetchAsync<ConfirmAutoUnmarkModel>(Arg.Any<GetDataForConfirmAutoUnmarkCriteria>());
        Assert.NotNull(actual);
    }
}