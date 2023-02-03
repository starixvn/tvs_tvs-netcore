using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.ConfirmAutoUnmark
{
    public class CombineValidationServiceTests
    {
        [Fact]
        public void CombineUpdateResult_HasError_ReturnFailedResult()
        {
            // Arrange
            var validationInAllServers = new List<UpdateConfirmAutoUnmarkValidation>
            {
                new()
                {
                    ErrorCode = 1,
                    ErrorMsg = "Fail"
                }
            };
            var service = new CombineValidationServiceImp();

            // Act
            var actual = service.CombineUpdateResult(validationInAllServers);

            // Assert
            Assert.False(actual.IsSuccessful);
        }

        [Fact]
        public void CombineUpdateResult_AllErrorCodeIs111_ReturnFailedResult()
        {
            // Arrange
            var validationInAllServers = new List<UpdateConfirmAutoUnmarkValidation>
            {
                new()
                {
                    ErrorCode = 111,
                    ErrorMsg = "Fail"
                }
            };
            var service = new CombineValidationServiceImp();

            // Act
            var actual = service.CombineUpdateResult(validationInAllServers);

            // Assert
            Assert.False(actual.IsSuccessful);
        }

        [Fact]
        public void CombineUpdateResult_AllResultSuccessful_ReturnSuccessfulResult()
        {
            // Arrange
            var validationInAllServers = new List<UpdateConfirmAutoUnmarkValidation>
            {
                new()
            };
            var service = new CombineValidationServiceImp();

            // Act
            var actual = service.CombineUpdateResult(validationInAllServers);

            // Assert
            Assert.True(actual.IsSuccessful);
        }
    }
}