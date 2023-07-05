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
            int leagueGroupId = 42;

            // Act
            bool result = leagueGroupId.IsLeagueGroupIdSaBa();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsLeagueGroupIdSaBa_LeagueGroupIdIsNotInSaBaList_ReturnFalse()
        {
            // Arrange
            int leagueGroupId = 88;

            // Act
            bool result = leagueGroupId.IsLeagueGroupIdSaBa();

            // Assert
            Assert.False(result);
        }
    }
}
