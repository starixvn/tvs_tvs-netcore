using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services.SendEmail.Subject;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Subject;

public class SubjectLabelsServiceTests
{
    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectVoidImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedBetsReportFor, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectVoidImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedBetsReportForIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectVoidAbnormalImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidAbnormalImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedAbnormalBetsReport, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectVoidAbnormalImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidAbnormalImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedAbnormalBetsReportIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectVoidCashOutImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidCashOutImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedCashOut, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectVoidCashOutImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidCashOutImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedCashOutIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectVoidNumberGameImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidNumberGameImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedNumberGame, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectVoidNumberGameImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidNumberGameImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedNumberGameIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectVoidVirtualSportsImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidVirtualSportsImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedVirtualSports, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectVoidVirtualSportsImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectVoidVirtualSportsImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_VoidedVirtualSportsIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectRecoverImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredBetReport, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectRecoverImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredBetReportIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectRecoverCashOutImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverCashOutImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredCashOut, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectRecoverCashOutImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverCashOutImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredCashOutIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectRecoverNumberGameImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverNumberGameImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredNumberGame, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectRecoverNumberGameImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverNumberGameImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredNumberGameIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectRecoverParlayImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverParlayImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredParlay, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectRecoverParlayImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverParlayImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredParlayIt, actual);
    }

    [Fact]
    public void Licensee_SubjectLabelsServiceIsSubjectRecoverVirtualSportsImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverVirtualSportsImp();

        // Act
        var actual = service.Licensee();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredVirtualSports, actual);
    }

    [Fact]
    public void It_SubjectLabelsServiceIsSubjectRecoverVirtualSportsImp_ReturnExpected()
    {
        // Arrange
        var service = new SubjectRecoverVirtualSportsImp();

        // Act
        var actual = service.It();

        // Assert
        Assert.Equal(StringResource.Subject_RecoveredVirtualSportsIt, actual);
    }
}