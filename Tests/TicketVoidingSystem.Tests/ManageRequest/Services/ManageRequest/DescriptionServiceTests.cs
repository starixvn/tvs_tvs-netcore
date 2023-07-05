using System;
using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest
{
    public class DescriptionServiceTests
    {
        private readonly DescriptionElementService elementService;
        private readonly DescriptionServiceImp descriptionService;

        public DescriptionServiceTests()
        {
            elementService = Substitute.For<DescriptionElementService>();
            descriptionService = new DescriptionServiceImp(elementService);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfBuildEKO()
        {
            // Arrange
            var expectedResult = "123";
            var request = new RequestDescription { IssueTypeId = 8 };
            elementService.BuildKoTime(Arg.Compat.Any<DateTime>()).ReturnsForAnyArgs("1");
            elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
            elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfBuildDefault()
        {
            // Arrange
            var expectedResult = "1234";
            var request = new RequestDescription { IssueTypeId = 1000 };
            elementService.BuildLogId(Arg.Compat.Any<int>(), Arg.Compat.Any<int>()).ReturnsForAnyArgs("1");
            elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
            elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");
            elementService.BuildTotal(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(), Arg.Compat.Any<List<string>>()).ReturnsForAnyArgs("4");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfBuildAbnormalBet()
        {
            // Arrange
            var expectedResult = "234";
            var request = new RequestDescription { IssueTypeId = 11 };
            elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
            elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");
            elementService.BuildTotal(Arg.Compat.Any<int>(), null, Arg.Compat.Any<List<string>>()).ReturnsForAnyArgs("4");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfAbnormalBetParlay()
        {
            // Arrange
            var expectedResult = "4";
            var request = new RequestDescription { IssueTypeId = IssueTypeConstant.AbnormalBet, FilterBy = 1 };
            elementService.BuildMixParlay(Arg.Compat.Any<int>()).ReturnsForAnyArgs("4");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfBuildDangerAccepted()
        {
            // Arrange
            const string expectedResult = "123";
            var request = new RequestDescription { IssueTypeId = 1, FilterBy = 1 };
            elementService.BuildVoidTime(Arg.Compat.Any<int>(), Arg.Compat.Any<DateTime>(), Arg.Compat.Any<DateTime>())
                .ReturnsForAnyArgs("1");
            elementService.BuildWithVarCheck(Arg.Compat.Any<string>(), Arg.Compat.Any<bool>()).ReturnsForAnyArgs("2");
            elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfAbnormalAccount()
        {
            // Arrange
            var expectedResult = "2021/01/11 - 2021/01/1910";
            var request = new RequestDescription { IssueTypeId = 13 };
            elementService.BuildVoidTimeAbnormalAccount(Arg.Compat.Any<DateTime>(), Arg.Compat.Any<DateTime>()).ReturnsForAnyArgs("2021/01/11 - 2021/01/19");
            elementService.BuildNoOfAccount(Arg.Compat.Any<int>()).ReturnsForAnyArgs("10");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfAbnormalBetRealMember()
        {
            // Arrange
            var expectedResult = "234";
            var request = new RequestDescription { IssueTypeId = IssueTypeConstant.AbnormalBetRealMember };
            elementService.BuildMatch(Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
            elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("3");
            elementService.BuildTotal(Arg.Compat.Any<int>(), null, Arg.Compat.Any<List<string>>()).ReturnsForAnyArgs("4");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfWrongScore()
        {
            // Arrange
            const string expectedResult = "234";
            var request = new RequestDescription { IssueTypeId = IssueTypeConstant.WrongScore, FilterBy = 1 };
            elementService.BuildWrongScores(Arg.Compat.Any<int>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("2");
            elementService.BuildWithVarCheck(Arg.Compat.Any<string>(), Arg.Compat.Any<bool>()).ReturnsForAnyArgs("3");
            elementService.BuildLeague(Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).ReturnsForAnyArgs("4");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void Build_WhenCalled_ReturnStringOfArchivedTicket()
        {
            // Arrange
            var expectedResult = "4";
            var request = new RequestDescription { IssueTypeId = IssueTypeConstant.ArchivedTicket };
            elementService.BuildTotal(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(), null).ReturnsForAnyArgs("4");

            // Act
            var actual = descriptionService.Build(request);

            // Assert
            Assert.Equal(expectedResult, actual);
        }
    }
}