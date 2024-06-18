using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalAccount;

public class CheckUsernameServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly GetTransInfoService getTransInfoService;
    private readonly CheckUsernameServiceImp service;

    public CheckUsernameServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        service = new CheckUsernameServiceImp(repository, getTransInfoService);
    }

    [Fact]
    public async Task CheckUsernames_ValidRequest_RepositoryHasCalled()
    {
        // Arrange(checkUsernamesModel, transInfoValidation, transInfoJsonCompress, ticketCalculateWinLostAccount, accounts

        var checkUsernamesModel = new List<CheckUsernamesModel> { new() { InvalidUserName = "1121" } };
        var transInfoValidation = new List<TransInfoAddRequestModel> { new() { MarkTransIds = "999" } };
        var transInfoJsonCompress = new List<string>();
        var ticketCalculateWinLostAccount = new List<TicketCalculateWinLostAccount>();
        var accounts = new List<AccountWinlostModel> { new() { Username = "1123" } };

        var request = new CheckValidUsernamesRequest { RequestId = 1 };
        getTransInfoService.GetTransInfoJson(null).ReturnsForAnyArgs(new List<string>());
        repository.FetchMultipleAsync<CheckUsernamesModel, TransInfoAddRequestModel, string, TicketCalculateWinLostAccount, AccountWinlostModel>(Arg.Any<CheckValidUsernamesCriteria>())
            .ReturnsForAnyArgs((checkUsernamesModel, transInfoValidation, transInfoJsonCompress, ticketCalculateWinLostAccount, accounts));

        // Act
        var actual = await service.ExecuteValidationInDb(request);

        // Assert
        await repository.Received(1).FetchMultipleAsync<CheckUsernamesModel, TransInfoAddRequestModel, string, TicketCalculateWinLostAccount, AccountWinlostModel>
            (Arg.Any<CheckValidUsernamesCriteria>());
        await getTransInfoService.Received(1).GetTransInfoJson(Arg.Any<GetTransInfoQuery>());
        Assert.Equal("1123", actual.AccountWinlost.First().Username);
        Assert.Equal("1121", actual.ValidationResult.InvalidUserName);
        Assert.Equal("999", actual.TransInfoValidation.MarkTransIds);
    }
}