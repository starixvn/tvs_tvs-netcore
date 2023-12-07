using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest;

public class AccountWinLostServiceTest
{
    private readonly IDynamicRepository repository;
    private readonly AccountWinLostServiceImp service;

    public AccountWinLostServiceTest()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new AccountWinLostServiceImp(repository);
    }

    [Fact]
    public async Task SaveAccountWinLost_ValidRequest_RepositoryHasCalled()
    {
        // Arrange
        var models = new List<AccountWinlostModel>
        {
            new ()
        };

        // Act
        await service.SaveAccountWinLost(1, 1, models);

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<SaveAccountWinLostCommand>());
    }

    [Fact]
    public async Task GetAccountWinLost_ValidRequest_RepositoryHasCalled()
    {
        // Arrange
        var models = new List<AccountWinlostModel>
        {
            new ()
        };
        repository.FetchAsync<AccountWinlostModel>(Arg.Any<GetAccountWinLostCriteria>()).ReturnsForAnyArgs(models);

        // Act
        var actual = await service.GetAccountWinLost(new GetAccountWinLostQuery());

        // Assert
        AssertExtension.Equal(models, actual);
        await repository.Received(1).FetchAsync<AccountWinlostModel>(Arg.Any<GetAccountWinLostCriteria>());
    }

    [Fact]
    public void GetAccountWinLostExcel_ValidRequest_RepositoryHasCalled()
    {
        // Arrange
        var models = new List<AccountWinlostModel>
        {
            new ()
        };

        // Act
        var actual = service.GetAccountWinLostExcel(models);

        // Assert
        Assert.Equal(1, actual.First().No);
        Assert.Single(actual);
    }
}
