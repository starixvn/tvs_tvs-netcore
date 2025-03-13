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
        var checkUsernamesModel = new List<ValidationInfo> { new() { InvalidUserName = "1121" } };
        var transInfoValidation = new List<TransInfoAddRequestModel> { new() { MarkTransIds = "999" } };
        var transInfoJsonCompress = new List<string>();
        var ticketCalculateWinLostAccount = new List<TicketCalculateWinLostAccount>();
        var accounts = new List<AccountWinlostModel> { new() { Username = "1123" } };

        var request = new CheckValidUsernamesRequest { RequestId = 1 };
        repository.FetchMultipleAsync<ValidationInfo, TransInfoAddRequestModel, string, TicketCalculateWinLostAccount, AccountWinlostModel>(Arg.Any<CheckValidUsernamesCriteria>())
            .ReturnsForAnyArgs((checkUsernamesModel, transInfoValidation, transInfoJsonCompress, ticketCalculateWinLostAccount, accounts));

        // Act
        var actual = await service.GetUsernameInfo(request);

        // Assert
        await repository.Received(1).FetchMultipleAsync<ValidationInfo, TransInfoAddRequestModel, string, TicketCalculateWinLostAccount, AccountWinlostModel>
            (Arg.Any<CheckValidUsernamesCriteria>());
        Assert.Equal("1123", actual.AccountWinlost.First().Username);
        Assert.Equal("1121", actual.ValidationResult.InvalidUserName);
        Assert.Equal("999", actual.ValidationResult.MarkTransIds);
    }
}