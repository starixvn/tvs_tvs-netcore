using Fanex.RemotingRef;
using NSubstitute;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.BetList
{
    public class LanguageCacheRefTests
    {
        private readonly string CurrentLanguage;
        private static readonly string DefaultValue = string.Empty;
        private readonly IRemotingRefService remotingRefService;
        private readonly LanguageCacheRef languageCacheRef;
        public string kenoBetTypeId, lotteryBetTypeId, tableGamesBetTypeId;

        public LanguageCacheRefTests()
        {
            CurrentLanguage = "language";
            remotingRefService = Substitute.For<IRemotingRefService>();
            languageCacheRef = new LanguageCacheRef("language", remotingRefService);
        }

        [Fact]
        public void GetTicket_RemotingRefServiceHasCalledGetBetTypeName()
        {
            // Arrange
            const string betTypeId = "1";
            const string resourceId = "1";
            const int refNo = 1;

            // Act
            _ = languageCacheRef.GetBetType(betTypeId, resourceId, refNo);

            // Assert
            remotingRefService.Received(1).GetBetTypeName(betTypeId, CurrentLanguage, DefaultValue, resourceId, refNo);
        }

        [Fact]
        public void GetParentBetTypeIdByBetTypeId_RemotingRefServiceHasCalledGetParentIdByBetTypeId()
        {
            // Arrange
            const string betTypeId = "1";
            const string defaultParentBetTypeId = "1";

            // Act
            _ = languageCacheRef.GetParentBetTypeIdByBetTypeId(betTypeId, defaultParentBetTypeId);

            // Assert
            remotingRefService.Received(1).GetParentIdByBetTypeId(betTypeId, defaultParentBetTypeId);
        }

        [Fact]
        public void GetSportName_RemotingRefServiceHasCalledGetSportName()
        {
            // Arrange
            const string sportId = "1";

            // Act
            _ = languageCacheRef.GetSportName(sportId);

            // Assert
            remotingRefService.Received(1).GetSportName(sportId, CurrentLanguage);
        }

        [Fact]
        public void GetTeamName_RemotingRefServiceHasCalledGetTeamName()
        {
            // Arrange
            const string teamId = "1";

            // Act
            _ = languageCacheRef.GetTeamName(teamId);

            // Assert
            remotingRefService.Received(1).GetTeamName(teamId, CurrentLanguage);
        }

        [Fact]
        public void GetTeamName3rd_RemotingRefServiceHasCalledGetTeamName3rd()
        {
            // Arrange
            const string team3rdId = "1";

            // Act
            _ = languageCacheRef.GetTeamName3rd(team3rdId);

            // Assert
            remotingRefService.Received(1).GetTeamName3rd(team3rdId, CurrentLanguage);
        }

        [Fact]
        public void GetRouletteBetItem_RemotingRefServiceHasCalledGetRouletteBetItem()
        {
            // Arrange
            const string itemId = "1";

            // Act
            _ = languageCacheRef.GetRouletteBetItem(itemId);

            // Assert
            remotingRefService.Received(1).GetRouletteBetItem(itemId, CurrentLanguage);
        }

        [Fact]
        public void GetCasinoBetItem_RemotingRefServiceHasCalledGetCasinoBetItem()
        {
            // Arrange
            const string betStatusId = "1";

            // Act
            _ = languageCacheRef.GetCasinoBetItem(betStatusId);

            // Assert
            remotingRefService.Received(1).GetCasinoBetItem(betStatusId, CurrentLanguage, DefaultValue);
        }

        [Fact]
        public void GetLeagueName_RemotingRefServiceHasCalledGetLeagueName()
        {
            // Arrange
            const string leagueId = "1";

            // Act
            _ = languageCacheRef.GetLeagueName(leagueId);

            // Assert
            remotingRefService.Received(1).GetLeagueName(leagueId, CurrentLanguage);
        }

        [Fact]
        public void GetLeagueName3rd_RemotingRefServiceHasCalledGetLeagueName3rd()
        {
            // Arrange
            const string league3rdId = "1";

            // Act
            _ = languageCacheRef.GetLeagueName3rd(league3rdId);

            // Assert
            remotingRefService.Received(1).GetLeagueName3rd(league3rdId, CurrentLanguage);
        }

        [Fact]
        public void GetHorseTeamName_RemotingRefServiceHasCalledGetHorseTeamName()
        {
            // Arrange
            const string codeId = "1";

            // Act
            _ = languageCacheRef.GetHorseTeamName(codeId);

            // Assert
            remotingRefService.Received(1).GetHorseTeamName(codeId, CurrentLanguage, DefaultValue);
        }

        [Fact]
        public void GetOddsTypeName_RemotingRefServiceHasCalledGetOddsTypeName()
        {
            // Arrange
            const string oddsTypeId = "1";

            // Act
            _ = languageCacheRef.GetOddsTypeName(oddsTypeId);

            // Assert
            remotingRefService.Received(1).GetOddsTypeName(oddsTypeId, CurrentLanguage);
        }

        [Fact]
        public void GetKenoBetChoiceName_RemotingRefServiceHasCalledGetKenoBetChoiceName()
        {
            // Arrange
            const string kenoBetChoiceId = "1";

            // Act
            _ = languageCacheRef.GetKenoBetChoiceName(kenoBetChoiceId, out kenoBetTypeId);
            // Assert
            remotingRefService.Received(1).GetKenoBetChoice(kenoBetChoiceId, CurrentLanguage, out kenoBetTypeId); 
        }

        [Fact]
        public void GetKenoBetTypeName_RemotingRefServiceHasCalledGetKenoBetType()
        {
            // Arrange
            // Act
            _ = languageCacheRef.GetKenoBetTypeName("1");
            // Assert
            remotingRefService.Received(1).GetKenoBetType("1", CurrentLanguage); 
        }

        [Fact]
        public void GetResourceData_RemotingRefServiceHasCalledGetResourceDataByRefIdAndResourceId()
        {
            // Arrange
            const string refId = "1";
            const string resourceId = "1";

            // Act
            _ = languageCacheRef.GetResourceData(refId, resourceId);

            // Assert
            remotingRefService.Received(1).GetResourceDataByRefIdAndResourceId(refId, resourceId, CurrentLanguage, DefaultValue);
        }

        [Fact]
        public void GetCombinationTypeCombo_RemotingRefServiceHasCalledGetCombinationTypeCombo()
        {
            // Arrange
            const string betTeam = "1";
            const string betCheck = "1";
            const int handicap1 = 1;
            const int handicap2 = 1;

            // Act
            _ = languageCacheRef.GetCombinationTypeCombo(betTeam, betCheck, handicap1, handicap2);

            // Assert
            remotingRefService.Received(1).GetCombinationTypeCombo(betTeam, betCheck, handicap1, handicap2, CurrentLanguage);
        }

        [Fact]
        public void GetFastMarketsChoice_RemotingRefServiceHasCalledGetFastMarketsChoice()
        {
            // Arrange
            const string betTypeId = "1";
            const string betTeam = "1";
            const int handicap1 = 1;
            const int handicap2 = 1;

            // Act
            _ = languageCacheRef.GetFastMarketsChoice(betTypeId, betTeam, handicap1, handicap2);

            // Assert
            remotingRefService.Received(1).GetFastMarketsChoice(betTypeId, betTeam, handicap1, handicap2, CurrentLanguage);
        }

        [Fact]
        public void GetLotteryBetChoiceName_RemotingRefServiceHasCalledGetLotteryBetChoice()
        {
            // Arrange
            const string lotteryBetChoiceId = "1";
            
            // Act
            _ = languageCacheRef.GetLotteryBetChoiceName(lotteryBetChoiceId, out lotteryBetTypeId);

            // Assert
            remotingRefService.Received(1).GetLotteryBetChoice(lotteryBetChoiceId, CurrentLanguage, out lotteryBetTypeId);
        }

        [Fact]
        public void GetLotteryBetTypeName_RemotingRefServiceHasCalledGetLotteryBetType()
        {
            // Arrange
            const string lotteryBettypeId = "1";

            // Act
            _ = languageCacheRef.GetLotteryBetTypeName(lotteryBettypeId);

            // Assert
            remotingRefService.Received(1).GetLotteryBetType(lotteryBettypeId, CurrentLanguage);
        }

        [Fact]
        public void GetBetRadarMatchCodeFormat_RemotingRefServiceHasCalledGetBetRadarMatchCodeFormat()
        {
            // Arrange
            const string matchCode = "1";

            // Act
            _ = languageCacheRef.GetBetRadarMatchCodeFormat(matchCode);

            // Assert
            remotingRefService.Received(1).GetBetRadarMatchCodeFormat(matchCode, CurrentLanguage);
        }

        [Fact]
        public void GetDisplayedBetType_RemotingRefServiceHasCalledGetDisplayedBetTypeName()
        {
            // Arrange
            const string betTypeId = "1";
            const string resourceId = "1";
            const int refNo = 1;

            // Act
            _ = languageCacheRef.GetDisplayedBetType(betTypeId, resourceId, refNo);

            // Assert
            remotingRefService.Received(1).GetDisplayedBetTypeName(betTypeId, resourceId, refNo, CurrentLanguage, DefaultValue);
        }

        [Fact]
        public void GetTableGamesBetChoiceName_RemotingRefServiceHasCalledGetTableGamesBetChoice()
        {
            // Arrange
            // Act
            _ = languageCacheRef.GetTableGamesBetChoiceName("1", out tableGamesBetTypeId);

            // Assert
            remotingRefService.Received(1).GetTableGamesBetChoice("1", CurrentLanguage, out tableGamesBetTypeId);
        }

        [Fact]
        public void GetTableGamesBetTypeName_RemotingRefServiceHasCalledGetTableGamesBetType()
        {
            // Arrange
            // Act
            _ = languageCacheRef.GetTableGamesBetTypeName("1");

            // Assert
            remotingRefService.Received(1).GetTableGamesBetType("1", CurrentLanguage);
        }
    }
}
