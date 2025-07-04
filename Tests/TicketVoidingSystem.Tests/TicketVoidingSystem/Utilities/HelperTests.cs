using System.Collections.Generic;
using TicketVoidingSystem.Utilities;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Utilities;

public class HelperTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
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

    [Fact]
    public void GetIntersectTransIdString_Return_IntersectTransIdString()
    {
        var testCase1 = new List<string>(){
            "123,456,789,100",
            "123,789, 100",
            "456,789",
        };
        var testCase2 = new List<string>(){
            "123,456,789,100",
            "123,456,789,100",
            "123,789",
        };
        var testCase3 = new List<string>(){
            "",
            "",
            "123",
        };
        Assert.Equal("789", Helper.GetIntersectTransIdString(testCase1));
        Assert.Equal("123,789", Helper.GetIntersectTransIdString(testCase2));
        Assert.Equal("", Helper.GetIntersectTransIdString(testCase3));
    }

    [Fact]
    public void GetUnionTransIdString_Return_IntersectTransIdString()
    {
        var testCase1 = new List<string>(){
            "123,456,789,100",
            "123,789,100",
            "456,789",
        };
        var testCase2 = new List<string>(){
            "456,789",
            "456,789",
            "123,789",
        };
        var testCase3 = new List<string>(){
            "",
            "",
            "123",
        };
        Assert.Equal("123,456,789,100", Helper.GetUnionTransIdString(testCase1));
        Assert.Equal("456,789,123", Helper.GetUnionTransIdString(testCase2));
        Assert.Equal("123", Helper.GetUnionTransIdString(testCase3));
    }
}