using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.BetList.Core.Entities;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.VoidSingleBet.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

public class UpdateListTicketsViewModelServiceTests
{
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Update_ValidParams_ModelHasUpdated(bool isMixParlay)
    {
        // Arrange
        var betTypeNameReplaceMessage = new ContentByLanguageModel
        {
            ContentEnglish = "ContentEnglish",
            ContentChineseTraditional = "ContentChineseTraditional",
            ContentChineseSimplified = "ContentChineseSimplified",
            ContentNewChineseSimplified = "ContentNewChineseSimplified"
        };
        var licenseeAffectedList = new AffectedLicenseeList();
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.Normal].LicenseesName = "12BET";
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.Instant].LicenseesName = "12BET";
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.CashOut].LicenseesName = "123, 343";
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.ChinaView].LicenseesName = "343";
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.JollyView].LicenseesName = "123";
        var expected = new ListTicketsViewModel
        {
            SmallestMapTicket = "1",
            TotalItems = 5,
            SingleCount = 4,
            ParlayCount = 1,
            BetTypeNameReplaceMessage = betTypeNameReplaceMessage,
            FromTransTime = new DateTime(2023, 5, 7, 2, 2, 2).ZoneManila(),
            ToTransTime = new DateTime(2023, 5, 9, 2, 2, 2).ZoneManila(),
            FromCheckTime = new DateTime(2023, 5, 7, 2, 2, 2).ZoneManila(),
            ToCheckTime = new DateTime(2023, 5, 9, 2, 2, 2).ZoneManila(),
            LicenseeAffectedList = licenseeAffectedList.LicenseeAffectedList,
            Inning = ""
        };
        var listTicketsViewModel = new ListTicketsViewModel();
        var tickets = new List<GetTicketModel>
        {
            new()
            {
                LicenseeName = "343", IsCashOut = true, IsDeposit = true, IsMixParlay = isMixParlay, IsChinaView = true, BetId = 801,
                BetType = 901, TransDate = new DateTime(2023, 5, 9, 2, 2, 2), CheckTime = new DateTime(2023, 5, 7, 2, 2, 2)
            },
            new()
            {
                LicenseeName = "343", IsCashOut = true, IsDeposit = false, IsMixParlay = !isMixParlay, BetId = 801,
                IsChinaView = true, TransDate = new DateTime(2023, 5, 7, 2, 2, 2),
                BetType = 901, CheckTime = new DateTime(2023, 5, 9, 2, 2, 2)
            },
            new()
            {
                LicenseeName = "12BET", IsInstantSettlement = true, IsDeposit = true, IsMixParlay = false, BetId = 801,
                IsChinaView = false, TransDate = new DateTime(2023, 5, 8, 2, 2, 2),
                BetType = 901, CheckTime = new DateTime(2023, 5, 8, 2, 2, 2)
            },
            new()
            {
                LicenseeName = "123", IsCashOut = true, IsDeposit = true, IsMixParlay = false, IsChinaView = false, BetId = 801,
                SpecialPlatform = 2, TransDate = new DateTime(2023, 5, 9, 2, 2, 2),
                BetType = 901, CheckTime = new DateTime(2023, 5, 8, 2, 2, 2)
            },
            new()
            {
                LicenseeName = "123", IsCashOut = true, IsDeposit = false, IsMixParlay = false, IsChinaView = false, BetId = 801,
                SpecialPlatform = 2, TransDate = new DateTime(2023, 5, 9, 2, 2, 2),
                BetType = 901, CheckTime = new DateTime(2023, 5, 8, 2, 2, 2)
            }
        };
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() { Name = "Map X", Id = "901" } }
        };
        var betListService = Substitute.For<BetListService>();
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("ContentEnglish");
        betListService.GetBetTypeNameChineseTraditional(Arg.Any<Ticket>())
            .ReturnsForAnyArgs("ContentChineseTraditional");
        betListService.GetBetTypeNameChineseSimplified(Arg.Any<Ticket>()).ReturnsForAnyArgs("ContentChineseSimplified");
        betListService.GetBetTypeNameNewChineseSimplified(Arg.Any<Ticket>())
            .ReturnsForAnyArgs("ContentNewChineseSimplified");

        var service = new UpdateListTicketsViewModelServiceImp(TestSetup.CreateMapper(), betListService, betTypesRepository);

        // Act
        await service.Update(listTicketsViewModel, tickets, 1, 1);

        // Assert
        AssertExtension.Equal(expected, listTicketsViewModel);
        betListService.Received().GetBetTypeName(Arg.Any<Ticket>());
    }

    [Fact]
    public async Task Update_HaveNotAnyTickets_BetListServiceHasNotCalled()
    {
        // Arrange
        var listTicketsViewModel = new ListTicketsViewModel();
        var betListService = Substitute.For<BetListService>();
        var service = new UpdateListTicketsViewModelServiceImp(TestSetup.CreateMapper(), betListService, null);

        // Act
        await service.Update(listTicketsViewModel, new List<GetTicketModel>(), 1, 1);

        // Assert
        Assert.NotNull(listTicketsViewModel);
        betListService.Received(0).GetBetTypeName(Arg.Any<Ticket>());
    }

    [Fact]
    public async Task Update_WithTimeMachineBetType_ShouldIncludeTimeMachineLicensee()
    {
        // Arrange
        var listTicketsViewModel = new ListTicketsViewModel();
        var tickets = new List<GetTicketModel>
        {
            new()
            {
                LicenseeName = "TimeMachine1",
                IsDeposit = true,
                BetType = 228,
                TransDate = DateTime.Now,
                CheckTime = DateTime.Now
            }
        };
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() { Name = "Map X", Id = "228" } }
        };
        var betListService = Substitute.For<BetListService>();
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("ContentEnglish");

        var service = new UpdateListTicketsViewModelServiceImp(TestSetup.CreateMapper(), betListService, betTypesRepository);

        // Act
        await service.Update(listTicketsViewModel, tickets, 1, 1);

        // Assert
        Assert.Equal("TimeMachine1", listTicketsViewModel.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.TimeMachine].LicenseesName);
    }

    [Fact]
    public async Task Update_WithJollySportsCv_ShouldIncludeJollySportsCvLicensee()
    {
        // Arrange
        var listTicketsViewModel = new ListTicketsViewModel();
        var tickets = new List<GetTicketModel>
        {
            new()
            {
                LicenseeName = "JollyCv1",
                IsDeposit = true,
                SpecialPlatform = SpecialPlatformConstant.JollySportsCv,
                TransDate = DateTime.Now,
                CheckTime = DateTime.Now
            }
        };
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() { Name = "Map X", Id = "1001" } }
        };
        var betListService = Substitute.For<BetListService>();
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("ContentEnglish");

        var service = new UpdateListTicketsViewModelServiceImp(TestSetup.CreateMapper(), betListService, betTypesRepository);

        // Act
        await service.Update(listTicketsViewModel, tickets, 1, 1);

        // Assert
        Assert.Equal("JollyCv1", listTicketsViewModel.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.JollySportCv].LicenseesName);
    }
}