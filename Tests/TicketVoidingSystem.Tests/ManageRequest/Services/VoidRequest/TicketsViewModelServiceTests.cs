using System;
using System.Collections.Generic;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class TicketsViewModelServiceTests
{
    private readonly TicketsViewModelServiceImp service;

    public TicketsViewModelServiceTests()
    {
        service = new TicketsViewModelServiceImp();
    }

    [Fact]
    public void UpdateViewModel_UpdateValidTickets_ReturnCorrect()
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
                SiteDbGroupId = 1
            },
            new()
            {
                TransId = 2,
                IsMixParlay = true,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2

            },
            new()
            {
                TransId = 3,
                IsCricket = true,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2

            },
            new()
            {
                TransId = 4,
                IsCancelCashOut = true,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2

            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };

        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Single(model.SingleTickets);
    }

    [Fact]
    public void UpdateViewModel_UpdateUncheckTickets_ReturnCorrect()
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
                SiteDbGroupId = 1
            },
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var uncheckedTransIds = new List<string> { "1" };

        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Equal(uncheckedTransIds.Count, model.UncheckedTransIds.Count);

    }


    [Fact]
    public void UpdateViewModel_UpdateLicenseeName_ReturnCorrect()
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
                GroupName = "123",
                MatchId = 1,
                SiteDbGroupId = 1,
                LicenseeName = "AB",
                IsInstantSettlement = true,
                IsDeposit = true,
                IsCashOut = true
            },
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var expectedLicenseeName = "AB";

        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Equal(expectedLicenseeName, model.LicenseesName);
        Assert.Equal(expectedLicenseeName, model.CashOutLicenseesName);

    }

    [Fact]
    public void UpdateViewModel_UpdateBetTypes_ReturnCorrect()
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
                SubBetType = 11
            },
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var expectedBetTypes = "11";

        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Equal(expectedBetTypes, model.BetTypes);
    }

    [Fact]
    public void UpdateViewModel_UpdateTimeViewModel_ReturnCorrect()
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
                IsCancelCashOut = true
            },
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
        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Equal(FromTime, model.FromTime);
        Assert.Equal(FromDate, model.FromDate);
        Assert.Equal(ToTime, model.ToTime);
        Assert.Equal(ToDate, model.ToDate);
    }

    [Fact]
    public void UpdateViewModel_HasOnlyCCOTicketNotAny_UpdateTimeFormCCOTicket()
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
            },
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };
        var MinTime = new DateTime(2022, 12, 1).ZoneManila();
        var MaxTime = new DateTime(2022, 12, 5).ZoneManila();

        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Equal(MinTime, model.FromTime);
        Assert.Equal(MaxTime, model.ToTime);
        Assert.Equal(MinTime, model.FromDate);
        Assert.Equal(MaxTime, model.ToDate);

    }

    [Fact]
    public void UpdateViewModel_UpdateCheckPermissionTickets_ReturnCorrect()
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
                IsCancelCashOut = false
            },
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };

        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Single(model.AllCancelCashOutTickets);
        Assert.Single(model.CheckPermissionTickets);
    }

    [Fact]
    public void UpdateViewModel_UpdateTotalCounts_ReturnCorrect()
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
                SiteDbGroupId = 1
            },
            new()
            {
                TransId = 2,
                IsMixParlay = true,
                IsCricket = false,
                IsCancelCashOut = false,
                GroupName = "(instant settlement)",
                MatchId = 2,
                SiteDbGroupId = 2

            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };

        // Act
        service.UpdateViewModel(model, allTickets, 0, 0, permission);

        // Assert
        Assert.Equal(2, model.Total);
        Assert.Equal(1, model.TotalSingle);
        Assert.Equal(1, model.TotalParlay);
        Assert.Equal(0, model.TotalCancelCashOut);
    }

    [Theory]
    [InlineData(6)] //Handicap
    [InlineData(119)]//FirstHalfHandicap
    [InlineData(120)]//OverUnder
    [InlineData(121)]//FirstHalfOverUnder
    public void UpdateViewModel_UpdateVariableForTemplateMessagesWrongOdds_ReturnTrue(int subIssueTypeId)
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
                SubBetType = 2
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };

        // Act
        service.UpdateViewModel(model, allTickets, 2, subIssueTypeId, permission);

        // Assert
        Assert.True(model.IsAllLiveTickets);
        Assert.True(model.IsHasAioMessage);
    }

    [Fact]
    public void UpdateViewModel_CheckAioMessageWrongOdds_ReturnFalse()
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
                SubBetType = 2
            }
        };
        var model = new TicketsViewModel();
        var permission = new VoidPermission
        {
            Settled = true
        };

        // Act
        service.UpdateViewModel(model, allTickets, 2, 1, permission);

        // Assert
        Assert.False(model.IsHasAioMessage);
    }
}