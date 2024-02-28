using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions;

public class MessageExtensionTests
{
    [Fact]
    public void CreateDeleteTransactionTicketsXml_InputTextIsNull_ReturnEmptyString()
    {
        // Arrange
        var betIds = new List<BetId>
        {
            new() { TransId = "1", MatchId = 1 }
        };
        var expected = "<root>" + Environment.NewLine + "  <r TransId=\"1\" MatchId=\"1\" />" + Environment.NewLine + "</root>";

        // Act
        var result = betIds.CreateDeleteTransactionTicketsXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void InsertSpace_InputTextIsNull_ReturnEmptyString()
    {
        // Arrange

        // Act
        var result = ((string)null).InsertSpace();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void InsertSpace_InputTextIsEmpty_ReturnEmptyString()
    {
        // Arrange
        var text = string.Empty;

        // Act
        var result = text.InsertSpace();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void InsertSpace_InputTextContainsAtSymbol_InsertSpaceAroundAtSymbol()
    {
        // Arrange
        const string text = "Hello@@World";

        // Act
        var result = text.InsertSpace();

        // Assert
        Assert.Equal("Hello @@ World", result);
    }

    [Fact]
    public void InsertSpace_InputTextContainsMultipleSpacesAroundAtSymbol_TrimResultString_()
    {
        // Arrange
        const string text = "  Hello   @@   World  ";

        // Act
        var result = text.InsertSpace();

        // Assert
        Assert.Equal("Hello @@ World", result);
    }

    [Fact]
    public void CreateItem_WhenCalledWithMessageItem_CreateXElementWithAttributes()
    {
        // Arrange
        var messageItem = new MessageItem
        {
            MessageId = 1,
            TargetId = 2,
            TargetName = "John",
            BetTransId = "100"
        };

        // Act
        var element = messageItem.CreateItem();

        // Assert
        Assert.Equal("Item", element.Name.LocalName);
        Assert.Equal("1", element.Attribute("MessageId").Value);
        Assert.Equal("2", element.Attribute("TargetId").Value);
        Assert.Equal("John", element.Attribute("TargetName").Value);
        Assert.Equal("100", element.Attribute("BetTransId").Value);
    }

    [Fact]
    public void CreateTicketsXml_WhenCalledWithEmailTickets_CreateXmlStringWithRootElementAndAttributes()
    {
        // Arrange
        var emailTickets = new List<TicketEmailModel>
        {
            new() { TransId = 1, CustId = 100, MatchId = 500 },
            new() { TransId = 2, CustId = 200, MatchId = 600 }
        };

        // Act
        var xmlString = emailTickets.CreateTicketsXml(false);

        // Assert
        var rootElement = XElement.Parse(xmlString);
        Assert.Equal("root", rootElement.Name.LocalName);
        Assert.Equal(2, rootElement.Elements("r").Count());
        var elements = rootElement.Elements("r").ToList();
        Assert.Equal("1", elements[0].Attribute("TransId").Value);
        Assert.Equal("100", elements[0].Attribute("CustId").Value);
        Assert.Equal("500", elements[0].Attribute("MatchId").Value);
        Assert.Equal("2", elements[1].Attribute("TransId").Value);
        Assert.Equal("200", elements[1].Attribute("CustId").Value);
        Assert.Equal("600", elements[1].Attribute("MatchId").Value);
    }
}