using System.Collections;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.VoidSingleBet.Tests.Services.GetTickets;

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

    internal static GetTicketModel CreateTicket(string status, string groupName, long transId, long handledTransId)
    {
        return new GetTicketModel
        {
            Status = status,
            GroupName = groupName,
            TransId = transId,
            MainTransId = handledTransId
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
    private static readonly CheckBoxModel DisableSubTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Sold", "Credit", 1000, 1001),
        Permission = CheckBoxServiceFactory.SetPermission(true, true, true),
        Expected = true
    };

    private static readonly CheckBoxModel ReadOnlyPermission = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "Credit", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, false),
        Expected = true
    };

    private static readonly CheckBoxModel UnsettledAndRunningTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "Credit", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = false
    };

    private static readonly CheckBoxModel UnsettledAndRefundedTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Refunded", "Credit", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = false
    };

    private static readonly CheckBoxModel UnsettledAndNormalSettledTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("WON", "Credit", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = true
    };

    private static readonly CheckBoxModel UnsettledAndInstantlySettledTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("WON", "Credit (Instant Settlement)", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, false, true),
        Expected = true
    };

    private static readonly CheckBoxModel InstantlySettledAndRunningTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "8RM", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private static readonly CheckBoxModel InstantlySettledAndRefundedTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Refunded", "8RM", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private static readonly CheckBoxModel InstantlySettledAndNormalSettledTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Lose", "8RM", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = true
    };

    private static readonly CheckBoxModel InstantlySettledAndInstantlySettledTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("lose", "8RM (Instant Settlement)", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(false, true, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndRunningTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Running", "Deposit", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndRefundedTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("Refunded", "Deposit", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndNormalSettledTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("draw", "Deposit", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel SettledAndInstantlySettledTicket = new CheckBoxModel
    {
        Ticket = CheckBoxServiceFactory.CreateTicket("DRAW", "Deposit (Instant Settlement)", 0, 0),
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOut = new CheckBoxModel
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = true,
            GroupName = "Cash Out"
        },
        Permission = CheckBoxServiceFactory.SetPermission(false, true, true),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOutTrue = new CheckBoxModel
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = true,
            GroupName = "Cash Out"
        },
        Permission = CheckBoxServiceFactory.SetPermission(true, false, true),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOutFalse = new CheckBoxModel
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = true,
            GroupName = "Cash Out"
        },
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private static readonly CheckBoxModel EnableForCashOutIsNotCashOut = new CheckBoxModel
    {
        Ticket = new GetTicketModel
        {
            IsCashOut = false,
            GroupName = "Deposit"
        },
        Permission = CheckBoxServiceFactory.SetPermission(true, false, false),
        Expected = false
    };

    private readonly IEnumerable<object[]> testCase = new List<object[]>
    {
        new object[] { DisableSubTicket },
        new object[] { ReadOnlyPermission },
        new object[] { UnsettledAndRunningTicket },
        new object[] { UnsettledAndRefundedTicket },
        new object[] { UnsettledAndNormalSettledTicket },
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
        new object[] { EnableForCashOutIsNotCashOut }
    };

    public IEnumerator<object[]> GetEnumerator() => testCase.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}