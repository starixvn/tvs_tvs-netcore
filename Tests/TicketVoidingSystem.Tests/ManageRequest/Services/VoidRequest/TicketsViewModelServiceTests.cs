using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class TicketsViewModelServiceTests
{
    [Fact]
    public async Task UpdateViewModel_UpdateValidTickets_ReturnCorrect()
    {
        // Arrange
        var allTickets = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = false,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "(instant settlement)",
                MatchId = 1,
                SiteDbGroupId = 1,
                Status = TicketStatus.Draw
            },
            new()
            {
                TransId = 2,
                IsMixParlay = true,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2,
                SubStatus = TicketStatus.Draw
            },
            new()
            {
                TransId = 3,
                IsCricket = true,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2,
                Status = TicketStatus.Draw
            },
            new()
            {
                TransId = 4,
                IsCancelCashOut = true,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2,
                Status = TicketStatus.Draw
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel> { allTickets[0] },
            ParlayTickets = new List<GetTicketModel> { allTickets[1] },
            CricketTickets = new List<GetTicketModel> { allTickets[2] },
            CancelCashOutTickets = new List<GetTicketModel> { allTickets[3] }
        };
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, allTickets, 0, permission, 1);

        // Assert
        Assert.Single(model.SingleTickets);
    }

    [Fact]
    public async Task UpdateViewModel_UpdateUncheckTickets_ReturnCorrect()
    {
        // Arrange
        var allTickets = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = false,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "phone betting",
                MatchId = 1,
                SiteDbGroupId = 1,
                Status = TicketStatus.Draw
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var uncheckedTransIds = new List<string> { "1" };
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel> { allTickets[0] },
            ParlayTickets = new List<GetTicketModel>(),
            CricketTickets = new List<GetTicketModel>(),
            CancelCashOutTickets = new List<GetTicketModel>()
        };
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, allTickets, 0, permission, 1);

        // Assert
        Assert.Equal(uncheckedTransIds.Count, model.UncheckedTransIds.Count);
    }

    [Fact]
    public async Task UpdateViewModel_UpdateBetTypes_ReturnCorrect()
    {
        // Arrange
        var allTickets = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = true,
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                BetType = 1,
                SubBetType = 11,
                SubStatus = TicketStatus.Draw
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel>(),
            ParlayTickets = new List<GetTicketModel>(),
            CricketTickets = new List<GetTicketModel>(),
            CancelCashOutTickets = allTickets
        };
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, allTickets, 0, permission, 1);

        // Assert
        Assert.Equal("11", model.BetTypes);
    }

    [Fact]
    public async Task UpdateViewModel_UpdateTimeViewModel_ReturnCorrect()
    {
        // Arrange
        var allTickets = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = true,
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                BetType = 1,
                SubBetType = 11,
                TransDate = new DateTime(2022, 12, 3),
                WinLostDate = new DateTime(2022, 12, 2),
                SubStatus = TicketStatus.Draw
            },
            new()
            {
                TransId = 1,
                IsMixParlay = true,
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                BetType = 1,
                SubBetType = 11,
                CheckTimeCancelCashOut = new DateTime(2022, 12, 4),
                IsCancelCashOut = true,
                SubStatus = TicketStatus.Draw
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var FromTime = new DateTime(2022, 12, 3).ZoneManila();
        var FromDate = new DateTime(2022, 12, 2).ZoneManila();
        var ToTime = new DateTime(2022, 12, 4).ZoneManila();
        var ToDate = new DateTime(2022, 12, 4).ZoneManila();
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel>(),
            ParlayTickets = new List<GetTicketModel> { allTickets[0] },
            CricketTickets = new List<GetTicketModel>(),
            CancelCashOutTickets = new List<GetTicketModel> { allTickets[1] }
        };
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, allTickets, 0, permission, 1);

        // Assert
        Assert.Equal(FromTime, model.FromTime);
        Assert.Equal(FromDate, model.FromDate);
        Assert.Equal(ToTime, model.ToTime);
        Assert.Equal(ToDate, model.ToDate);
    }

    [Fact]
    public async Task UpdateViewModel_HasOnlyCCOTicketNotAny_UpdateTimeFormCCOTicket()
    {
        // Arrange
        var ticketCancelCashOut = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = true,
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                BetType = 1,
                SubBetType = 11,
                CheckTimeCancelCashOut = new DateTime(2022, 12, 1),
                IsCancelCashOut = true
            },
            new()
            {
                TransId = 1,
                IsMixParlay = true,
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                BetType = 1,
                SubBetType = 11,
                CheckTimeCancelCashOut = new DateTime(2022, 12, 5),
                IsCancelCashOut = true
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel>(),
            ParlayTickets = new List<GetTicketModel>(),
            CricketTickets = new List<GetTicketModel>(),
            CancelCashOutTickets = ticketCancelCashOut
        };
        var MinTime = new DateTime(2022, 12, 1).ZoneManila();
        var MaxTime = new DateTime(2022, 12, 5).ZoneManila();
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, ticketCancelCashOut, 0, permission, 1);

        // Assert
        Assert.Equal(MinTime, model.FromTime);
        Assert.Equal(MaxTime, model.ToTime);
        Assert.Equal(MinTime, model.FromDate);
        Assert.Equal(MaxTime, model.ToDate);
    }

    [Fact]
    public async Task UpdateViewModel_UpdateCheckPermissionTickets_ReturnCorrect()
    {
        // Arrange
        var allTickets = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = true,
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                BetType = 1,
                SubBetType = 11,
                IsCancelCashOut = true,
                SubStatus = TicketStatus.Won,
                GroupPHAffected = 1
            },
            new()
            {
                TransId = 1,
                IsMixParlay = true,
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                BetType = 1,
                SubBetType = 11,
                IsCancelCashOut = false,
                SubStatus = TicketStatus.Draw,
                GroupPHAffected = 2
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel>(),
            ParlayTickets = new List<GetTicketModel>(),
            CricketTickets = new List<GetTicketModel>(),
            CancelCashOutTickets = allTickets
        };
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, allTickets, 0, permission, 1);

        // Assert
        Assert.Single(model.AllCancelCashOutTickets);
        Assert.Single(model.CheckPermissionTickets);
    }

    [Fact]
    public async Task UpdateViewModel_UpdateTotalCounts_ReturnCorrect()
    {
        // Arrange
        var allTickets = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = false,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "(instant settlement)",
                MatchId = 1,
                SiteDbGroupId = 1,
                Status = TicketStatus.Won,
                GroupPHAffected = 1
            },
            new()
            {
                TransId = 2,
                IsMixParlay = true,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2,
                Status = TicketStatus.Won
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel> { allTickets[0] },
            ParlayTickets = new List<GetTicketModel> { allTickets[1] },
            CricketTickets = new List<GetTicketModel>(),
            CancelCashOutTickets = new List<GetTicketModel>()
        };
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, allTickets, 0, permission, 1);

        // Assert
        Assert.Equal(2, model.Total);
        Assert.Equal(1, model.TotalSingle);
        Assert.Equal(1, model.TotalParlay);
        Assert.Equal(0, model.TotalCancelCashOut);
    }

    [Fact]
    public async Task UpdateViewModel_UpdateVariableForTemplateMessagesWrongOdds_ReturnTrue()
    {
        // Arrange
        var allTickets = new List<GetTicketModel>
        {
            new()
            {
                TransId = 1,
                IsMixParlay = false,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "(instant settlement)",
                MatchId = 1,
                SiteDbGroupId = 1,
                IsLiveIndicator = true,
                BetType = 2,
                SubBetType = 2,
                Status = TicketStatus.Won,
                GroupPHAffected = 2
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var ticketsGroup = new TicketsByGroupInRequest
        {
            SingleTickets = new List<GetTicketModel> { allTickets[0] },
            ParlayTickets = new List<GetTicketModel>(),
            CricketTickets = new List<GetTicketModel>(),
            CancelCashOutTickets = new List<GetTicketModel>()
        };
        var getTicketsViewModelService = Substitute.For<GetTicketsViewModelService>();
        var getInfoTicketsForMessage = Substitute.For<GetInfoTicketsForMessage>();
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel> { new() }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        getTicketsViewModelService.GetValidTickets(Arg.Any<TicketsByGroupInRequest>(), Arg.Any<VoidPermission>(),
            Arg.Any<int>()).ReturnsForAnyArgs(ticketsGroup);
        getTicketsViewModelService.GetTicketsByGroup(Arg.Any<IEnumerable<GetTicketModel>>()).ReturnsForAnyArgs(ticketsGroup);
        var service = new TicketsViewModelServiceImp(getTicketsViewModelService, getInfoTicketsForMessage, betTypesRepository);

        // Act
        await service.UpdateViewModel(model, allTickets, 2, permission, 1);

        // Assert
        Assert.True(model.IsAllLiveTickets);
    }
}