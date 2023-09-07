using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.Web;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Handlers;

public class GetRemarkHandlerTests
{
    [Theory]
    [ClassData(typeof(RemarkTestCase))]
    public async Task GetRemark_CheckPermission_ReturnRemarkWithPermission(bool settled, bool unSettled, bool instantlySettled, List<string> expected)
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
        AssertExtension.Equal(expected, results);
    }

    private class RemarkModelTest
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
                "You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time and SABA Time Machine settled tickets."
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
                "You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time and SABA Time Machine settled tickets."
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
                "You can void \"Instantly Settled\" tickets settled by Instant Settlement during live time and SABA Time Machine settled tickets."
            }
        };

        private static readonly RemarkModelTest NotAnyPermission = new()
        {
            Settled = false,
            UnSettled = false,
            InstantlySettled = false,
            Expected = new List<string>()
        };

        public IEnumerator<object[]> GetEnumerator()
        {
            var remarkTests = new List<RemarkModelTest> { OnlySettled, OnlyUnSettled, SettledAndInstant, UnSettledAndInstant, OnlyInstant, NotAnyPermission };
            var testCase = remarkTests.Select(x => new object[] { x.Settled, x.UnSettled, x.InstantlySettled, x.Expected });
            return testCase.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}