using System.Collections;
using Fanex.NAP.Core.Business;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.VoidSingleBet.Tests.Handlers;

public class GetRemarkHandlerTests
{
    [Theory]
    [ClassData(typeof(RemarkTestCase))]
    public async Task GetRemark_CheckPermission_ReturnRemarkWithPermission(bool settled, bool unSettled,
        bool instantlySettled, List<string> expected)
    {
        // Arrange
        var sessionService = Substitute.For<SessionService>();
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host)
            .Returns(settled);
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host)
            .Returns(unSettled);
        sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host)
            .Returns(instantlySettled);
        var handler = new GetRemarkHandler(sessionService);

        // Act
        var results = await handler.Handle(new GetRemarkRequest(), CancellationToken.None);

        // Assert
        Assert.Equal(expected, results);
    }

    public class RemarkModelTest
    {
        public bool Settled { get; set; }

        public bool UnSettled { get; set; }

        public bool InstantlySettled { get; set; }

        public List<string> Expected { get; set; }
    }

    private class RemarkTestCase : IEnumerable<object[]>
    {
        private static readonly RemarkModelTest OnlySettled = new()
        {
            Settled = true,
            UnSettled = false,
            InstantlySettled = false,
            Expected = new List<string> { "You can void \"Settled\" or \"Unsettled\" tickets." }
        };

        private static readonly RemarkModelTest OnlyUnSettled = new()
        {
            Settled = false,
            UnSettled = true,
            InstantlySettled = false,
            Expected = new List<string> { "You can only void \"Unsettled\" tickets." }
        };

        private static readonly RemarkModelTest SettledAndInstant = new()
        {
            Settled = true,
            UnSettled = false,
            InstantlySettled = true,
            Expected = new List<string>
            {
                "You can void \"Settled\" or \"Unsettled\" tickets.",
                "You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time."
            }
        };

        private static readonly RemarkModelTest UnSettledAndInstant = new()
        {
            Settled = false,
            UnSettled = true,
            InstantlySettled = true,
            Expected = new List<string>
            {
                "You can only void \"Unsettled\" tickets.",
                "You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time."
            }
        };

        private static readonly RemarkModelTest OnlyInstant = new()
        {
            Settled = false,
            UnSettled = false,
            InstantlySettled = true,
            Expected = new List<string>
            {
                "You can only void \"Unsettled\" tickets.",
                "You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time."
            }
        };

        private static readonly RemarkModelTest NotAnyPermission = new()
        {
            Settled = false,
            UnSettled = false,
            InstantlySettled = false,
            Expected = new List<string>()
        };

        private readonly IEnumerable<object[]> testCase = new List<object[]>
        {
            new object[] { OnlySettled.Settled, OnlySettled.UnSettled, OnlySettled.InstantlySettled, OnlySettled.Expected },
            new object[] { OnlyUnSettled.Settled, OnlyUnSettled.UnSettled, OnlyUnSettled.InstantlySettled, OnlyUnSettled.Expected },
            new object[] { SettledAndInstant.Settled, SettledAndInstant.UnSettled, SettledAndInstant.InstantlySettled, SettledAndInstant.Expected },
            new object[] { UnSettledAndInstant.Settled, UnSettledAndInstant.UnSettled, UnSettledAndInstant.InstantlySettled, UnSettledAndInstant.Expected },
            new object[] { OnlyInstant.Settled, OnlyInstant.UnSettled, OnlyInstant.InstantlySettled, OnlyInstant.Expected },
            new object[] { NotAnyPermission.Settled, NotAnyPermission.UnSettled, NotAnyPermission.InstantlySettled, NotAnyPermission.Expected }
        };

        public IEnumerator<object[]> GetEnumerator() => testCase.GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}