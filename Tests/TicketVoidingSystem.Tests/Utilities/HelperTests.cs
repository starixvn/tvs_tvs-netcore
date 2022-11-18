using TicketVoidingSystem.Utilities;
using Xunit;

namespace TicketVoidingSystem.Tests.Utilities
{
    public class HelperTests
    {
        [Fact]
        public void GetSettingKeyBySiteDbGroupId_HasSPName_ReturnSettingKey()
        {
            // Arrange
            const string expected = "DBCTG.XXX";

            // Act
            var actual = Helper.GetSettingKeyBySiteDbGroupId(0, "XXX");

            // Assert
            Assert.Equal(expected, actual);
        }
    }
}