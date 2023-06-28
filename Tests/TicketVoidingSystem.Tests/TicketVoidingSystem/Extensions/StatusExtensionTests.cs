using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions
{
    public class StatusExtensionTests
    {
        [Fact]
        public void IsRunningOrWaiting_StatusIsRunning_ReturnTrue()
        {
            // Arrange
            string status = TicketStatus.Running;

            // Act
            bool result = status.IsRunningOrWaiting();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsRunningOrWaiting_StatusIsWaiting_ReturnTrue()
        {
            // Arrange
            string status = TicketStatus.Waiting;

            // Act
            bool result = status.IsRunningOrWaiting();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsRunningOrWaiting_StatusIsNull_ReturnFalse()
        {
            // Arrange
            string status = null;

            // Act
            bool result = status.IsRunningOrWaiting();

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsRunningOrWaiting_StatusIsEmpty_ReturnFalse()
        {
            // Arrange
            string status = "";

            // Act
            bool result = status.IsRunningOrWaiting();

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsRunningOrWaiting_StatusIsNotRunningOrWaiting_ReturnFalse()
        {
            // Arrange
            string status = TicketStatus.Void;

            // Act
            bool result = status.IsRunningOrWaiting();

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsVoided_StatusIsVoid_ReturnTrue()
        {
            // Arrange
            string status = TicketStatus.Void;

            // Act
            bool result = status.IsVoided();

            // Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData(TicketStatus.Sold)]
        [InlineData(TicketStatus.Won)]
        [InlineData(TicketStatus.Draw)]
        public void IsVoided_StatusIsNotVoidCase_Returnfalse(string status)
        {
            // Act
            bool result = status.IsVoided();

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("")]
        [InlineData("Running")]
        [InlineData("Waiting")]
        [InlineData("Draw")]
        [InlineData("Won")]
        [InlineData("Lose")]
        public void IsVoided_StatusIsNotVoid_ReturnFalse(string status)
        {
            // Act
            bool result = status.IsVoided();

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void SettledStatusContainStatus_ReturnTrue()
        {
            // Arrange
            string status = TicketStatus.Draw;

            // Act
            bool result = status.IsSettled();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsSettled_SettledStatusNotContainStatus_ReturnFalse()
        {
            // Arrange
            string status = TicketStatus.Waiting;

            // Act
            bool result = status.IsSettled();

            // Assert
            Assert.False(result);
        }

    }
}
