using System.Collections;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Services.ExportExcel;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Services.ExportExcel;

public class TitleModel
{
    public int GroupBy { get; set; }

    public bool IsGroup { get; set; }

    public static int MatchId => 123456;

    public static string LicenseeName => "12Bet";

    public static string BetTypeName => "Handicap";

    public string Expected { get; set; }
}

internal class TitleTestCase : IEnumerable<object[]>
{
    private static readonly TitleModel GroupByIsEqualToZeroAndIsGroupHasValue = new()
    {
        GroupBy = 0,
        IsGroup = true,
        Expected = "Tickets Listing for - Match ID: 123456 - Licensee: 12Bet"
    };

    private static readonly TitleModel GroupByIsEqualToZeroAndIsGroupHasNotValue = new()
    {
        GroupBy = 0,
        IsGroup = false,
        Expected = "Tickets Listing for - Match ID: 123456 - Licensee: 12Bet - Bet Type: Handicap"
    };

    private static readonly TitleModel GroupByIsNotEqualToZeroAndIsGroupHasValue = new()
    {
        GroupBy = 1,
        IsGroup = true,
        Expected = "Tickets Listing for - Match ID: 123456 - Bet Type: Handicap"
    };

    private static readonly TitleModel GroupByIsNotEqualToZeroAndIsGroupHasNotValue = new()
    {
        GroupBy = 1,
        IsGroup = false,
        Expected = "Tickets Listing for - Match ID: 123456 - Bet Type: Handicap - Licensee: 12Bet"
    };

    private readonly IEnumerable<object[]> testCase = new List<object[]>
    {
        new object[] { GroupByIsEqualToZeroAndIsGroupHasValue.GroupBy, GroupByIsEqualToZeroAndIsGroupHasValue.IsGroup, GroupByIsEqualToZeroAndIsGroupHasValue.Expected },
        new object[] { GroupByIsEqualToZeroAndIsGroupHasNotValue.GroupBy, GroupByIsEqualToZeroAndIsGroupHasNotValue.IsGroup, GroupByIsEqualToZeroAndIsGroupHasNotValue.Expected },
        new object[] { GroupByIsNotEqualToZeroAndIsGroupHasValue.GroupBy, GroupByIsNotEqualToZeroAndIsGroupHasValue.IsGroup, GroupByIsNotEqualToZeroAndIsGroupHasValue.Expected },
        new object[] { GroupByIsNotEqualToZeroAndIsGroupHasNotValue.GroupBy, GroupByIsNotEqualToZeroAndIsGroupHasNotValue.IsGroup, GroupByIsNotEqualToZeroAndIsGroupHasNotValue.Expected },
        new object[] { GroupByIsEqualToZeroAndIsGroupHasValue.GroupBy, GroupByIsEqualToZeroAndIsGroupHasValue.IsGroup, GroupByIsEqualToZeroAndIsGroupHasValue.Expected }
    };

    public IEnumerator<object[]> GetEnumerator() => testCase.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

public class CellServiceTests
{
    [Theory]
    [ClassData(typeof(TitleTestCase))]
    public void CreateTitle_CheckGroupByAndIsGroup_ReturnTitle(int groupBy, bool isGroup, string expected)
    {
        // Arrange
        var query = new ExportExcelQuery
        {
            MatchId = TitleModel.MatchId,
            LicenseeName = TitleModel.LicenseeName,
            BetTypeName = TitleModel.BetTypeName,
            GroupBy = groupBy,
            IsGroup = isGroup
        };
        var service = new CellServiceImp();

        // Act
        var actual = service.CreateTitle(query);

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void AddMatch_ValidMatchCodeFromQuery_ReturnValueInA5Cells()
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var query = new ExportExcelQuery { MatchCode = "Match Code" };
        var service = new CellServiceImp();

        // Act
        service.AddMatch(worksheet, query);

        // Assert
        Assert.Equal(query.MatchCode, worksheet.Cells["A5"].Value);
    }

    [Fact]
    public void AddMatch_ValidMatchEventFromQuery_ReturnValueInB5Cells()
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var query = new ExportExcelQuery { MatchEvent = "Match Event" };
        var service = new CellServiceImp();

        // Act
        service.AddMatch(worksheet, query);

        // Assert
        Assert.Equal(query.MatchEvent, worksheet.Cells["B5"].Value);
    }

    [Fact]
    public void AddMatch_ValidEventDateFromQuery_ReturnValueInD5Cells()
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var query = new ExportExcelQuery { EventDate = new DateTime(2017, 5, 25, 9, 20, 40) };
        const string expected = "05/25/2017";
        var service = new CellServiceImp();

        // Act
        service.AddMatch(worksheet, query);

        // Assert
        Assert.Equal(expected, worksheet.Cells["D5"].Value);
    }

    [Fact]
    public void SetStyle_WrapText_ReturnTrue()
    {
        // Arrange
        var sheet = TestSetup.CreateTestingSheet();
        sheet.Cells["A8"].Value = 1;
        var service = new CellServiceImp();

        // Act
        service.SetStyle(sheet, true);

        // Assert
        Assert.True(sheet.Cells.Style.WrapText);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void SetStyle_CheckIsNumberGame_HighLightFontRightColumn(bool isNumberGame)
    {
        // Arrange
        var sheet = TestSetup.CreateTestingSheet();
        sheet.Cells["H8"].Value = -200;
        sheet.Cells["G8"].Value = -200;
        var service = new CellServiceImp();

        // Act
        service.SetStyle(sheet, isNumberGame);

        // Assert
        Assert.True(sheet.Cells.Style.WrapText);
    }

    [Fact]
    public void AddMatch_IsBitCoin_UpdateEventTime()
    {
        // Arrange
        var worksheet = TestSetup.CreateTestingSheet();
        var query = new ExportExcelQuery { EventDate = new DateTime(2017, 5, 25, 9, 20, 40), Product = GameType.BitCoin };
        const string expected = "05/25/2017";
        var service = new CellServiceImp();

        // Act
        service.AddMatch(worksheet, query);

        // Assert
        Assert.Equal(expected, worksheet.Cells["D5"].Value);
    }
}