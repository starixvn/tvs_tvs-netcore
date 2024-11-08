using TicketVoidingSystem.Extensions;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions
{
    public class LeagueExtensionTests
    {
        [Fact]
        public void IsLeagueGroupIdSaBa_LeagueGroupIdIsInSaBaList_ReturnTrue()
        {
            // Arrange
            var leagueGroupId = 42;

            // Act
            var result = leagueGroupId.IsLeagueGroupIdSaBa();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsLeagueGroupIdSaBa_LeagueGroupIdIsNotInSaBaList_ReturnFalse()
        {
            // Arrange
            var leagueGroupId = 88;

            // Act
            var result = leagueGroupId.IsLeagueGroupIdSaBa();

            // Assert
            Assert.False(result);
        }
    }
}