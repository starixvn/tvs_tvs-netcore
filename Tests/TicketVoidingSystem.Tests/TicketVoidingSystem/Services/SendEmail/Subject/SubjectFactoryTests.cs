using TicketVoidingSystem.Services.SendEmail.Subject;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Subject
{
    public class SubjectFactoryTests
    {
        [Fact]
        public void CreateVoid_HasTypeIsCashOut_ReturnSubjectVoidCashOutImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateVoid(VoidType.CashOut);

            // Assert
            AssertExtension.Equal(new SubjectVoidCashOutImp(), actual);
        }

        [Fact]
        public void CreateVoid_HasTypeIsNumberGame_ReturnSubjectVoidNumberGameImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateVoid(VoidType.NumberGame);

            // Assert
            AssertExtension.Equal(new SubjectVoidNumberGameImp(), actual);
        }

        [Fact]
        public void CreateVoid_HasTypeIsVirtualSports_ReturnSubjectVoidVirtualSportsImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateVoid(VoidType.VirtualSports);

            // Assert
            AssertExtension.Equal(new SubjectVoidVirtualSportsImp(), actual);
        }

        [Fact]
        public void CreateVoid_HasTypeIsAbnormal_ReturnSubjectVoidAbnormalImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateVoid(VoidType.Abnormal);

            // Assert
            AssertExtension.Equal(new SubjectVoidAbnormalImp(), actual);
        }

        [Fact]
        public void CreateVoid_HasTypeIsNone_ReturnSubjectVoidImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateVoid(VoidType.None);

            // Assert
            AssertExtension.Equal(new SubjectVoidImp(), actual);
        }

        [Fact]
        public void CreateRecover_HasTypeIsCashOut_ReturnSubjectRecoverCashOutImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateRecover(RecoverType.CashOut);

            // Assert
            AssertExtension.Equal(new SubjectRecoverCashOutImp(), actual);
        }

        [Fact]
        public void CreateRecover_HasTypeIsNumberGame_ReturnSubjectRecoverNumberGameImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateRecover(RecoverType.NumberGame);

            // Assert
            AssertExtension.Equal(new SubjectRecoverNumberGameImp(), actual);
        }

        [Fact]
        public void CreateRecover_HasTypeIsParlay_ReturnSubjectRecoverParlayImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateRecover(RecoverType.Parlay);

            // Assert
            AssertExtension.Equal(new SubjectRecoverParlayImp(), actual);
        }

        [Fact]
        public void CreateRecover_HasTypeIsVirtualSports_ReturnSubjectRecoverVirtualSportsImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateRecover(RecoverType.VirtualSports);

            // Assert
            AssertExtension.Equal(new SubjectRecoverVirtualSportsImp(), actual);
        }

        [Fact]
        public void CreateRecover_HasTypeIsNone_ReturnSubjectRecoverImp()
        {
            // Arrange

            // Act
            var actual = SubjectFactory.CreateRecover(RecoverType.None);

            // Assert
            AssertExtension.Equal(new SubjectRecoverImp(), actual);
        }
    }
}
