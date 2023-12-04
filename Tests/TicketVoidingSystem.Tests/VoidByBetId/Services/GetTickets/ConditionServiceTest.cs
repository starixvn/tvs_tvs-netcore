using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.GetTickets
{
    [Category("VoidByBetId")]
    public class ConditionServiceTest
    {
        [Theory]
        [InlineData(501, true, false)]
        [InlineData(500, false, false)]
        [InlineData(501, false, true)]
        public void IsNetPosition_CheckBetTypeAndIsDeposit_ReturnCricketAndIsNotDeposit(int betType, bool isDeposit, bool expected)
        {
            // Arrange
            var service = new ConditionServiceImp();

            // Act
            var isNetPosition = service.IsNetPosition(betType, isDeposit);

            // Assert
            Assert.Equal(expected, isNetPosition);
        }

        [Theory]
        [ClassData(typeof(TestCase))]
        public void UnitOfWorkName_ScenarioUnderTest_ExpectedBehavior(CheckBoxModel model)
        {
            // Arrange
            var service = new ConditionServiceImp();

            // Act
            var isDisable = service.IsDisableCheckBox(model.Item, model.Permission, false);

            // Assert
            Assert.Equal(model.Expected, isDisable);
        }
    }

    public class CheckBoxModel
    {
        public GetTicketModel Item { get; set; }

        public UserPermission Permission { get; set; }

        public bool Expected { get; set; }
    }

    internal class TestCase : IEnumerable<object[]>
    {
        private static readonly CheckBoxModel PhoneBettingWon = new()
        {
            Item = new GetTicketModel { GroupName = "phone betting", Status = "won" },
            Permission = new UserPermission { SettledTicket = true },
            Expected = false
        };

        private static readonly CheckBoxModel PhoneBettingLose = new()
        {
            Item = new GetTicketModel { GroupName = "phone betting", Status = "Lose" },
            Permission = new UserPermission { SettledTicket = true },
            Expected = false
        };

        private static readonly CheckBoxModel PhoneBettingDraw = new()
        {
            Item = new GetTicketModel { GroupName = "phone betting", Status = "DRAW" },
            Permission = new UserPermission { SettledTicket = true },
            Expected = false
        };

        private static readonly CheckBoxModel IsSubTicket = new()
        {
            Item = new GetTicketModel { GroupName = "credit", TransId = 321, MainTransId = 123 },
            Permission = new UserPermission { SettledTicket = true },
            Expected = true
        };

        private static readonly CheckBoxModel IsOnlyReadPermission = new()
        {
            Item = new GetTicketModel { GroupName = "credit", Status = "running" },
            Permission = new UserPermission { SettledTicket = false, UnSettledTicket = false },
            Expected = true
        };

        private static readonly CheckBoxModel IsSettledPermission = new()
        {
            Item = new GetTicketModel { GroupName = "credit", Status = "WON" },
            Permission = new UserPermission { SettledTicket = true },
            Expected = false
        };

        private static readonly CheckBoxModel IsUnSettledPermissionAndSettledTicket = new()
        {
            Item = new GetTicketModel { GroupName = "credit", Status = "WON" },
            Permission = new UserPermission { UnSettledTicket = true },
            Expected = true
        };

        private static readonly CheckBoxModel IsUnSettledPermissionAndUnsettledTicket = new()
        {
            Item = new GetTicketModel { GroupName = "credit", Status = "running" },
            Permission = new UserPermission { UnSettledTicket = true },
            Expected = false
        };

        private static readonly CheckBoxModel PhoneBetIsUnSettledPermission = new()
        {
            Item = new GetTicketModel { GroupName = "phone betting", Status = "Lose" },
            Permission = new UserPermission { SettledTicket = false },
            Expected = true
        };

        private readonly IEnumerable<object[]> testCase = new List<object[]>
        {
            new object[] { PhoneBettingWon },
            new object[] { PhoneBettingLose },
            new object[] { PhoneBettingDraw },
            new object[] { IsSubTicket },
            new object[] { IsOnlyReadPermission },
            new object[] { IsSettledPermission },
            new object[] { IsUnSettledPermissionAndSettledTicket },
            new object[] { IsUnSettledPermissionAndUnsettledTicket },
            new object[] { PhoneBetIsUnSettledPermission }
        };

        public IEnumerator<object[]> GetEnumerator() => testCase.GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}