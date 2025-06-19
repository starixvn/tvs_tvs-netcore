using System.Collections;
using System.Collections.Generic;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

public class CheckBoxServiceTests
{
    [Theory]
    [ClassData(typeof(CheckBoxTestCase))]
    public void IsDisable_AllowUserVoidTicket_ReturnTrue(CheckBoxModel model)
    {
        // Arrange
        var service = new CheckBoxServiceImp();

        // Act
        var actual = service.IsDisable(model.Ticket, model.Permission);

        // Assert
        Assert.Equal(model.Expected, actual);
    }
}

public static class CheckBoxServiceFactory
{
    internal static UserPermission SetPermission(bool settled, bool instantly, bool unsettled)
    {
        return new UserPermission
        {
            SettledTicket = settled,
            InstantlySettledTicket = instantly,
            UnSettledTicket = unsettled
        };
    }

    internal static GetTicketModel CreateTicket(string status, string groupName, long transId, long handledTransId, bool isMixParlay, string subStatus, bool isCashOut = false)
    {
        return new GetTicketModel
        {
            Status = status,
            GroupName = groupName,
            TransId = transId,
            MainTransId = handledTransId,
            IsMixParlay = isMixParlay,
            SubStatus = subStatus,
            IsCashOut = isCashOut
        };
    }
}

public class CheckBoxModel
{
    public GetTicketModel Ticket { get; set; }

    public UserPermission Permission { get; set; }

    public bool Expected { get; set; }
}

internal class CheckBoxTestCase : IEnumerable<object[]>
{
    private static readonly CheckBoxModel DisableSubTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Sold", "Credit", 1000, 1001, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(true, true, true),
        Expected = true
    };

    private static readonly CheckBoxModel ReadOnlyPermission = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "Credit", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, false),
        Expected = true
    };

    private static readonly CheckBoxModel UnsettledAndRunningTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "Credit", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = false
    };

    private static readonly CheckBoxModel UnsettledAndRefundedTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Refunded", "Credit", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = false
    };

    private static readonly CheckBoxModel UnsettledAndNormalSettledTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("WON", "Credit", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = true
    };

    private static readonly CheckBoxModel UnsettledAndIsCashOut = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("WON", "Credit", 0, 0, false, "", true),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = false
    };

    private static readonly CheckBoxModel UnsettledAndInstantlySettledTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("WON", "Credit (Instant Settlement)", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = true
    };

    private static readonly CheckBoxModel CheckStatusIsTrue = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("WON", "Credit", 0, 0, true, "Draw"),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = true
    };

    private static readonly CheckBoxModel InstantlySettledAndRunningTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "8RM", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private static readonly CheckBoxModel InstantlySettledAndRefundedTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Refunded", "8RM", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private static readonly CheckBoxModel InstantlySettledAndNormalSettledTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Lose", "8RM", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = true
    };

    private static readonly CheckBoxModel InstantlySettledAndInstantlySettledTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("lose", "8RM (Instant Settlement)", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndRunningTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "Deposit", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndRefundedTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Refunded", "Deposit", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndNormalSettledTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("draw", "Deposit", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndInstantlySettledTicket = new()
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("DRAW", "Deposit (Instant Settlement)", 0, 0, false, ""),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOut = new()
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = true,
            GroupName = "Cash Out"
        },
        Permission = CheckBoxServiceFactory.SetPermission(false, true, true),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOutTrue = new()
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = true,
            GroupName = "Cash Out"
        },
        Permission = CheckBoxServiceFactory.SetPermission(true, false, true),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOutFalse = new()
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = true,
            GroupName = "Cash Out"
        },
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOutIsNotCashOut = new()
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = false,
            GroupName = "Deposit"
        },
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForSabaTrue = new()
    {
        Ticket = new GetTicketModel
        {
            BetType = 228
        },
        Permission = CheckBoxServiceFactory.SetPermission(false, false, false),
        Expected = true
    };

    private static readonly CheckBoxModel EnableForSabaFalse = new()
    {
        Ticket = new GetTicketModel
        {
            BetType = 229,
            Status = "won"
        },
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForSabaFalseTicketParlay = new()
    {
        Ticket = new GetTicketModel
        {
            BetType = 229,
            SubStatus = "won",
            IsMixParlay = true,
        },
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private readonly IEnumerable<object[]> testCase = new List<object[]>
    {
        new object[] { DisableSubTicket },
        new object[] { ReadOnlyPermission },
        new object[] { UnsettledAndRunningTicket },
        new object[] { UnsettledAndRefundedTicket },
        new object[] { UnsettledAndNormalSettledTicket },
        new object[] { UnsettledAndIsCashOut },
        new object[] { UnsettledAndInstantlySettledTicket },
        new object[] { InstantlySettledAndRunningTicket },
        new object[] { InstantlySettledAndRefundedTicket },
        new object[] { InstantlySettledAndNormalSettledTicket },
        new object[] { InstantlySettledAndInstantlySettledTicket },
        new object[] { SettledAndRunningTicket },
        new object[] { SettledAndRefundedTicket },
        new object[] { SettledAndNormalSettledTicket },
        new object[] { SettledAndInstantlySettledTicket },
        new object[] { EnableForCashOut },
        new object[] { EnableForCashOutTrue },
        new object[] { EnableForCashOutFalse },
        new object[] { EnableForCashOutIsNotCashOut },
        new object[] { EnableForSabaTrue },
        new object[] { EnableForSabaFalse },
        new object[] { CheckStatusIsTrue },
        new object[] { EnableForSabaFalseTicketParlay }
    };

    public IEnumerator<object[]> GetEnumerator() => testCase.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}