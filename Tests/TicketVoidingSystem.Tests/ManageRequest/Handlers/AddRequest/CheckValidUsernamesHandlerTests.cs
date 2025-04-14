using NSubstitute;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount.CalculateVoidTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class CheckValidUsernamesHandlerTests
{
    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidUsernamesRequest();
        var validation = new ValidationInfo
        {
            UnMarkTransIds = "123",
            MarkTransIds = "456"
        };
        var checkResult = new CheckUsernamesInDatabaseResult
        {
            ValidationResult = validation,
            AccountWinlost = new List<AccountWinlostModel>(),
            TicketCalculateWinLostAccount = new List<TicketCalculateWinLostAccount>()
        };
        var calcVoidTicketsResult = new CalcVoidTicketsResult
        {
            Accounts = new List<AccountWinlostModel> { new() },
            VoidTickets = new List<TicketCalculateWinLostAccount> { new() }
        };
        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = new ValidationInfo
            {
                UnMarkTransIds = "123",
                MarkTransIds = "456"
            },
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = null,
                UnMarkTransIds = "123",
                MarkTransIds = "456",
                TransInfoJson = "AAA"
            }
        };
        var usernameCheckService = Substitute.For<UsernameCheckService>();
        var calculateVoidTicketsService = Substitute.For<CalculateVoidTicketsService>();
        var compressDataAddRequestService = Substitute.For<CompressDataService>();
        compressDataAddRequestService.CompressTicket<GetTicketModel>(null).ReturnsForAnyArgs("AAA");
        calculateVoidTicketsService.ExecuteForAbnormalAccountWithPolicy(null, null, null)
            .ReturnsForAnyArgs(calcVoidTicketsResult);
        usernameCheckService.GetUsernameInformation(null).ReturnsForAnyArgs(checkResult);
        var handler = new CheckValidUsernamesHandler(usernameCheckService, calculateVoidTicketsService, compressDataAddRequestService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }

    [Fact]
    public async Task Handler_IsAutoVoidAbnormalAccount_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidUsernamesRequest
        {
            StatusIds = "1,2",
            ActionId = ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId,
            AccountWinlostModels = new List<AccountWinlostModel> { new() { Username = "123AA" } }
        };
        var calcVoidTicketsResult = new CalcVoidTicketsResult
        {
            Accounts = new List<AccountWinlostModel> { new() },
            VoidTickets = new List<TicketCalculateWinLostAccount> { new() }
        };
        var validation = new ValidationInfo
        {
            UnMarkTransIds = "123",
            MarkTransIds = "456"
        };
        var checkResult = new CheckUsernamesInDatabaseResult
        {
            ValidationResult = validation,
            AccountWinlost = new List<AccountWinlostModel> { new() { Username = "123AA" } },
            TicketCalculateWinLostAccount = new List<TicketCalculateWinLostAccount> { new() }
        };

        var viewModel = new CheckValidUsernamesViewModel
        {
            Validation = new ValidationInfo
            {
                UnMarkTransIds = "123",
                MarkTransIds = "456"
            },
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = null,
                UnMarkTransIds = "123",
                MarkTransIds = "456",
                TransInfoJson = "AAA"
            },
            AccountWinlostModels = calcVoidTicketsResult.Accounts
        };
        var usernameCheckService = Substitute.For<UsernameCheckService>();
        var calculateVoidTicketsService = Substitute.For<CalculateVoidTicketsService>();
        var compressDataAddRequestService = Substitute.For<CompressDataService>();
        compressDataAddRequestService.CompressTicket<GetTicketModel>(null).ReturnsForAnyArgs("AAA");
        calculateVoidTicketsService.ExecuteForAbnormalAccountWithPolicy(null, null, null)
            .ReturnsForAnyArgs(calcVoidTicketsResult);
        usernameCheckService.GetUsernameInformation(null).ReturnsForAnyArgs(checkResult);
        var handler = new CheckValidUsernamesHandler(usernameCheckService, calculateVoidTicketsService, compressDataAddRequestService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
        compressDataAddRequestService.Received(1).CompressTicket(Arg.Any<IEnumerable<TicketCalculateWinLostAccount>>());
        await calculateVoidTicketsService.Received(1)
            .ExecuteForAbnormalAccountWithPolicy(Arg.Any<string>(), Arg.Any<IList<TicketCalculateWinLostAccount>>(), Arg.Any<IEnumerable<AccountWinlostModel>>());
    }
}