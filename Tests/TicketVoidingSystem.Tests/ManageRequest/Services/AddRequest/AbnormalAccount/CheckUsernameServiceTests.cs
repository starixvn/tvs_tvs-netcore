using Fanex.Data.Repository;
using NSubstitute;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount;

public class CheckUsernameServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly CheckUsernameServiceImp service;

    public CheckUsernameServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new CheckUsernameServiceImp(repository);
    }

    [Fact]
    public async Task GetUsernameInfo_ValidRequest_RepositoryHasCalled()
    {
        var validationInfo = new List<ValidationInfo> { new() { InvalidUserName = "1121", MarkTransIds = "2" } };
        var ticketCalculateWinLostAccount = new List<TicketCalculateWinLostAccount>();
        var accounts = new List<AccountWinlostModel> { new() { Username = "1123" } };

        var request = new CheckValidUsernamesRequest { RequestId = 1 };
        repository.FetchMultipleAsync<ValidationInfo, TicketCalculateWinLostAccount, AccountWinlostModel>(Arg.Any<CheckValidUsernamesCriteria>())
            .ReturnsForAnyArgs((validationInfo, ticketCalculateWinLostAccount, accounts));

        // Act
        var actual = await service.GetUsernameInfo(request);

        // Assert
        await repository.Received().FetchMultipleAsync<ValidationInfo, TicketCalculateWinLostAccount, AccountWinlostModel>
            (Arg.Any<CheckValidUsernamesCriteria>());
        Assert.Equal("1123", actual.AccountWinlost.First().Username);
        Assert.Equal("1121,1121,1121,1121", actual.ValidationResult.InvalidUserName);
        Assert.Equal("2,2,2,2", actual.ValidationResult.MarkTransIds);
    }
}