using System.Collections.Generic;
using Fanex.BetList.Core.Entities;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Services.MessageTemplate;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Services.MessageTemplate;

public class SpecialBetTypeContentServiceTests
{
    private readonly BetListService betListService;
    private readonly SpecialBetTypeContentServiceImp service;

    public SpecialBetTypeContentServiceTests()
    {
        betListService = Substitute.For<BetListService>();
        service = new SpecialBetTypeContentServiceImp(betListService);
    }

    [Fact]
    public void GetContentForVoidPage_ReturnExpected()
    {
        // Arrange
        List<TicketEmailModel> tickets = [new() { BetId = 1, BetTypeId  = 1}, new() { SubBetCheck = "2", IsMixParlay = true, SubBetType = 1},
            new() { SubBetCheck = "", IsMixParlay = true, SubBetType = 1 }];

        betListService.GetBetTypeName(Arg.Any<Ticket>()).Returns("Handicap");
        betListService.GetBetTypeNameChineseTraditional(Arg.Any<Ticket>()).Returns("Handicap");
        betListService.GetBetTypeNameChineseSimplified(Arg.Any<Ticket>()).Returns("Handicap");
        betListService.GetBetTypeNameNewChineseSimplified(Arg.Any<Ticket>()).Returns("Handicap");
        var expected = new ContentByLanguageModel
        {
            ContentEnglish = "Handicap",
            ContentChineseTraditional = "Handicap",
            ContentChineseSimplified = "Handicap",
            ContentNewChineseSimplified = "Handicap",
        };

        // Act
        var result = service.GetContentForVoidPage(tickets);

        // Assert
        AssertExtension.Equal(expected, result);
    }
}