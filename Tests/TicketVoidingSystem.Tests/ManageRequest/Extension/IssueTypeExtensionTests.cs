using TicketVoidingSystem.ManageRequest.Extension;
using Xunit;
namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class IssueTypeExtensionTests
{
    [Theory]
    [InlineData(1, false)]
    [InlineData(13, true)]
    public void IsAbnormalAccount_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange

        // Act
        var actual = issueTypeId.IsAbnormalAccount();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(1, false)]
    [InlineData(10, true)]
    public void IsRedCard_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsRedCard();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(10, false)]
    [InlineData(1, true)]
    public void IsDangerAccepted_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsDangerAccepted();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(10, false)]
    [InlineData(11, true)]
    [InlineData(15, true)]
    public void IsAbnormalBet_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsLikelyAbnormalBet();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(10, false)]
    [InlineData(9, true)]
    public void IsWrongKickOffTime_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsWrongKickOffTime();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(10, false)]
    [InlineData(8, true)]
    public void IsEarlyKickOffTime_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsEarlyKickOffTime();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(10, false)]
    [InlineData(3, true)]
    public void IsIsWrongScore_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsWrongScore();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(10, false)]
    [InlineData(17, true)]
    public void IsArchivedTicket_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsArchivedTicket();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(1, false)]
    [InlineData(5, true)]
    public void IsWrong1stHDP_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsWrong1stHDP();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(1, false)]
    [InlineData(4, true)]
    public void IsWrongHDP_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsWrongHDP();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(1, false)]
    [InlineData(7, true)]
    public void IsWrong1stOU_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsWrong1stOU();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(1, false)]
    [InlineData(6, true)]
    public void IsWrongOU_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsWrongOU();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(8, true)]
    [InlineData(9, true)]
    [InlineData(1, false)]
    public void IsEarlyKickOffOrWrongKickOff_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsEarlyKickOffOrWrongKickOff();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(13, true)]
    [InlineData(11, true)]
    [InlineData(1, false)]
    public void IsAbnormalAccountOrAbnormalBet_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.IsIssueTypeVoidMainParlay();

        // Assert
        Assert.Equal(result, actual);
    }

    [Theory]
    [InlineData(20, true)]
    [InlineData(1, false)]
    public void DuplicateTickets_ValidParams_ReturnResult(int issueTypeId, bool result)
    {
        // Arrange
        // Act
        var actual = issueTypeId.DuplicateTickets();

        // Assert
        Assert.Equal(result, actual);
    }
}