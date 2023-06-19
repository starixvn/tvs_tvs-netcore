using System;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services
{
    public class DescriptionElementServiceTests
    {

        [Fact]
        public void BuildKOTime_WhenCalled_ReturnString()
        {
            // Arrange
            var expectedResult = $"<div class=\"ko-time\">KO Time: <span class=\"text-success\">0001/01/01 12:00:00 PM</span></div>";
            var time = new DateTime();
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildKoTime(time);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(4)]
        public void BuildVoidTime_FilterByTransTime_ReturnString(int filterBy)
        {
            // Arrange
            var expectedResult = "<div class=\"void-time\"><span class=\"text-success\">Void Trans Time: 12:00:00.000 PM - 12:00:00.000 PM</span></div>";
            var time = new DateTime();
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildVoidTime(filterBy, time, time);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildVoidTime_FilterByCheckTime_ReturnString()
        {
            // Arrange
            var expectedResult = $"<div class=\"void-time\"><span class=\"text-primary\">Void Accept Time: 12:00:00.000 PM - 12:00:00.000 PM</span></div>";
            var time = new DateTime();
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildVoidTime(2, time, time);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildLogId_FromIdEqualToId_ReturnString()
        {
            // Arrange
            var fromId = 1;
            var told = 1;
            var expectedResult = $"<div class\"log-id\">LogID: <span class=\"text-danger\">1</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildLogId(fromId, told);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildLogId_FromIdNotEqualToId_ReturnString()
        {
            // Arrange
            var fromId = 1;
            var told = 2;
            var expectedResult = $"<div class\"log-id\">LogID: <span class=\"text-danger\">1-2</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildLogId(fromId, told);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildMatch_WhenCalled_ReturnString()
        {
            // Arrange
            var expectedResult = $"<div class=\"match\">abc</div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildMatch("abc");

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildLeague_WhenCalled_ReturnString()
        {
            // Arrange
            var sportTypeName = "1";
            var leagueName = "2";
            var expectedResult = $"<div class=\"event\"><span class=\"sport\">{sportTypeName} </span><span class=\"league text-uppercase\">{leagueName}</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildLeague(sportTypeName, leagueName);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildTotal_IsSingle_ReturnString()
        {
            // Arrange
            var single = 1;
            var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">{single}</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildTotal(single, null, new List<string>());

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildTotal_HasParlay_ReturnString()
        {
            // Arrange
            var single = 1;
            var parlay = 1;
            var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildTotal(single, parlay, new List<string>());

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildTotal_BettypeNamesHasOneElement_ReturnString()
        {
            // Arrange
            var single = 1;
            var parlay = 1;
            var bettypeNames = new List<string>();
            bettypeNames.Add("abc");
            var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span> (abc)</div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildTotal_BettypeNamesHasFourElement_ReturnString()
        {
            // Arrange
            var single = 1;
            var parlay = 1;
            var bettypeNames = new List<string> { "1", "2", "3", "4" };
            var expectedResult = $"<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">"
                + $"{single}</span>, Parlay: <span class=\"text-primary total-parlay\">{parlay}</span> (1, 2, 3...)</div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildTotal_BettypeNamesEmpty_ReturnString()
        {
            // Arrange
            var single = 1;
            var parlay = 1;
            var bettypeNames = new List<string>{"1"};
            var expectedResult = "<div class=\"count-tickets\">Single: <span class=\"text-primary total-single\">1"
                                  + "</span>, Parlay: <span class=\"text-primary total-parlay\">1</span> (1)</div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildTotal(single, parlay, bettypeNames);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildVoidTimeAbnormalAccount_HasDate_ReturnString()
        {
            // Arrange
            var fromDate = new DateTime(2021, 01, 11);
            var toDate = new DateTime(2021, 01, 19);
            var expectedResult = "<div class=\"void-time\">Void Time: <span class=\"text-success\">2021/01/11 - 2021/01/19</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildVoidTimeAbnormalAccount(fromDate, toDate);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildNoOfAccount_HasTotal_ReturnString()
        {
            // Arrange
            var expectedResult = "<div class=\"no-of-account\">No. of Account: <span class=\"text-primary total-account\">10<span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildNoOfAccount(10);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [InlineData(1)]
        [InlineData(4)]
        public void BuildWrongScores_HasScore_ReturnString(int filterBy)
        {
            // Arrange
            var expectedResult = "<div class=\"text-success\"><div class=\"void-wrong-score\">Void Trans Time - Void Wrong Score: <span class=\"wrong-score\">0-0<span></div></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildWrongScores(filterBy, "0-0");

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildWrongScores_FilterByCheckTime_ReturnString()
        {
            // Arrange
            var expectedResult = "<div class=\"text-primary\"><div class=\"void-wrong-score\">Void Accept Time - Void Wrong Score: <span class=\"wrong-score\">0-0<span></div></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildWrongScores(2, "0-0");

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildMixParlay_HasTotal_ReturnString()
        {
            // Arrange
            var expectedResult = "<div>Mix Parlay: <span class=\"text-primary total-parlay\">1</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildMixParlay(1);

            // Assert
            Assert.Equal(expectedResult, actual);
        }

        [Fact]
        public void BuildWithVarCheck_HasCheckedVar_ReturnString()
        {
            // Arrange
            var expectedResult = "<div><span class=\"text-danger var-check\"><strong>VAR</strong> - </span>" +
                                 "<span class=\"match\">1</span></div>";
            var descriptionService = new DescriptionElementServiceImp();

            // Act
            var actual = descriptionService.BuildWithVarCheck("1", true);

            // Assert
            Assert.Equal(expectedResult, actual);
        }
    }
}