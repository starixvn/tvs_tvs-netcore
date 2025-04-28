using System.Collections.Generic;
using System.Linq;
using Fanex.BetList.Core.Builder;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.Factories;
using Fanex.BetList.Core.Templates;
using Fanex.BetList.Core.TicketHelper;
using HtmlAgilityPack;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.BetList;

public interface BetListService
{
    Choice_Template BuildChoiceBlock(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);

    string BuildChoice(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);

    string BuildChoiceExcel(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);

    string BuildStake(ITicket ticket, ITicketHelper ticketHelper);

    string GetOdds(ITicket ticket, bool isParlay);

    string GetBetType(object betTypeId, string language);

    string GetDisplayedBetTypeName(int id, long refNo);

    string GetBetTypeName(Ticket ticket);

    string GetBetTypeName(int id, long refNo);

    string GetBetTeam(Choice_Template choice);

    string GetBetTypeNameChineseSimplified(Ticket ticket);

    string GetBetTypeNameChineseTraditional(Ticket ticket);

    string GetBetTypeNameNewChineseSimplified(Ticket ticket);

    string GetStatus(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowVnIp);

    string GetComboParlayName(ITicket ticket);

    string[] GetComboName(string betTeam, string betCheck, decimal handicap1, decimal handicap2);

    string GetVirtualSportMatchCode(int sportType, string matchCode);

    string GetSportTypeName(int sportType, string languageCode);

    string GetHandicap(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);

    string GetScoreBetListUi(int sportType, bool isLiveIndicator, short liveHomeScore, short liveAwayScore);
}

public class BetListServiceImp(RemotingRefWrapperService remotingRefWrapperService, OddsService oddsService)
    : BetListService
{
    private static BetListHTMLBuilder Builder
    {
        get
        {
            var factory = new BetListHTMLFactory();
            return factory.CreateBuilder();
        }
    }

    private static BetListExcelBuilder ExcelBuilder
    {
        get
        {
            var excelFactory = new BetListExcelFactory();
            return excelFactory.CreateBuilder();
        }
    }

    public Choice_Template BuildChoiceBlock(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap)
    {
        return Builder.BuildChoiceBlock(ticket, ticketHelper, ticketData, isShowScoreMap);
    }

    public string BuildChoice(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap)
    {
        return Builder.BuildChoice(ticket, ticketHelper, ticketData, isShowScoreMap);
    }

    public string BuildChoiceExcel(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap)
    {
        var choiceBuilder = ExcelBuilder.CreateChoiceBuilder(ticket.BetTypeId);
        var choices = choiceBuilder.RenderRTF(ticket, ticketHelper, ticketData, isShowScoreMap, ExcelBuilder.RTFHelper);
        return choices[0].ToString();
    }

    public string BuildStake(ITicket ticket, ITicketHelper ticketHelper)
    {
        return Builder.BuildStake(ticket, ticketHelper);
    }

    public string GetOdds(ITicket ticket, bool isParlay)
    {
        GetCachePropertyById oddsTypeName = remotingRefWrapperService.GetOddsTypeName;
        var oddHtml = Builder.BuildOdds(ticket, null, oddsTypeName);
        var oddName = oddsService.GetOddsName(oddHtml);
        oddName = isParlay ? string.Empty : oddName;

        if (isParlay)
        {
            return "-";
        }

        return string.IsNullOrWhiteSpace(oddName) ? oddHtml.Replace("<br />", " ") : oddHtml.Replace("<br />", " (") + ")";
    }

    public string GetBetType(object betTypeId, string language)
    {
        return remotingRefWrapperService.GetBetType(betTypeId, language);
    }

    public string GetBetTeam(Choice_Template choice)
    {
        choice.ScoreMapIcon = null;
        choice.BetType = null;
        choice.Match = null;
        choice.League = null;
        choice.Handicap = null;
        choice.Score = null;

        return choice;
    }

    public string GetBetTypeName(int id, long refNo)
    {
        var betTypeId = remotingRefWrapperService.GetParentIdByBetTypeId(id);
        if (string.IsNullOrWhiteSpace(betTypeId) || betTypeId == "0")
        {
            betTypeId = id.ToString();
        }

        var betName = remotingRefWrapperService.GetBetType(betTypeId, refNo);
        const int FistNextBet = 86;
        const int SecondNextBet = 85;
        return id is FistNextBet or SecondNextBet ? $"Next {betName}" : betName;
    }

    public string GetBetTypeName(Ticket ticket)
    {
        var ticketHelper = new TicketHelper();
        var factory = new BetListBaseBuilder();
        var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
        var ticketCopy = MessagePackCloner.Clone(ticket);

        if (BetTypeConstant.BetTypesNotNeedRefNoGetBetType.Contains(ticketCopy.BetTypeId))
        {
            ticketCopy.RefNo = null;
        }
        return builder.GetBetTypeName(ticketCopy, ticketHelper);
    }

    public string GetBetTypeNameChineseSimplified(Ticket ticket)
    {
        var ticketHelper = new TicketHelper(new LanguageCacheRef(LanguageCode.ChineseSimplified));
        var factory = new BetListBaseBuilder();
        var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
        var ticketCopy = MessagePackCloner.Clone(ticket);

        if (BetTypeConstant.BetTypesNotNeedRefNoGetBetType.Contains(ticketCopy.BetTypeId))
        {
            ticketCopy.RefNo = null;
        }

        var betTypeName = builder.GetBetTypeName(ticketCopy, ticketHelper);

        return betTypeName.TranslateChineseSimplified();
    }

    public string GetBetTypeNameChineseTraditional(Ticket ticket)
    {
        var ticketHelper = new TicketHelper(new LanguageCacheRef(LanguageCode.ChineseTraditional));
        var factory = new BetListBaseBuilder();
        var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
        var ticketCopy = MessagePackCloner.Clone(ticket);

        if (BetTypeConstant.BetTypesNotNeedRefNoGetBetType.Contains(ticketCopy.BetTypeId))
        {
            ticketCopy.RefNo = null;
        }
        var betTypeName = builder.GetBetTypeName(ticketCopy, ticketHelper);

        return betTypeName;
    }

    public string GetBetTypeNameNewChineseSimplified(Ticket ticket)
    {
        var ticketHelper = new TicketHelper(new LanguageCacheRef(LanguageCode.NewChineseSimplified));
        var factory = new BetListBaseBuilder();
        var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
        var ticketCopy = MessagePackCloner.Clone(ticket);

        if (BetTypeConstant.BetTypesNotNeedRefNoGetBetType.Contains(ticketCopy.BetTypeId))
        {
            ticketCopy.RefNo = null;
        }
        var betTypeName = builder.GetBetTypeName(ticketCopy, ticketHelper);

        return betTypeName;
    }

    public string GetDisplayedBetTypeName(int id, long refNo)
    {
        var betTypeId = remotingRefWrapperService.GetParentIdByBetTypeId(id);
        if (string.IsNullOrWhiteSpace(betTypeId) || betTypeId == "0")
        {
            betTypeId = id.ToString();
        }

        var betName = remotingRefWrapperService.GetDisplayedBetTypeName(betTypeId, refNo);
        const int FistNextBet = 86;
        const int SecondNextBet = 85;
        return id is FistNextBet or SecondNextBet ? $"Next {betName}" : betName;
    }

    public string GetStatus(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowVnIp)
    {
        var factory = new BetListBaseBuilder();
        ticketHelper.HideStatusCashOutHistory = true;
        var statusBuilder = factory.CreateStatusBuilder(ticket.BetTypeId);
        var status = statusBuilder.Render(ticket, ticketHelper, ticketData, isShowVnIp);
        status.CashOutHistory = null;
        status.ShowIP = null;
        status.StatusResult = null;
        status.NewCashOutHistory = null;

        return status;
    }

    public string GetComboParlayName(ITicket ticket)
    {
        var comboNames = string.IsNullOrEmpty(ticket.BetCheck) ?
            null : remotingRefWrapperService.GetComboParlayName(ticket.BetTeam, ticket.BetCheck, ticket.Handicap1, ticket.Handicap2);
        var html = string.Empty;
        var count = comboNames?.Length ?? 0;
        for (var i = 0; i < count; i++)
        {
            html = comboNames[i] == string.Empty ?
                html : html + $" <div><span class='combo-name'>{comboNames[i]}</span></div>";
        }

        return html;
    }

    public string[] GetComboName(string betTeam, string betCheck, decimal handicap1, decimal handicap2)
    {
        return remotingRefWrapperService.GetComboParlayName(betTeam, betCheck, handicap1, handicap2);
    }

    public string GetVirtualSportMatchCode(int sportType, string matchCode)
    {
        if (sportType.IsRacingVirtualSports() || sportType is SportTypeConstant.VirtualBetByBasketball)
        {
            return "-";
        }
        if (sportType.IsVirtualSport2())
        {
            return remotingRefWrapperService.GetMatchCodeBetRadar(matchCode);
        }

        return sportType.IsVirtualSport345() ? remotingRefWrapperService.GetMatchCodeVS345(sportType, matchCode) : matchCode;
    }

    public string GetSportTypeName(int sportType, string languageCode)
    {
        return remotingRefWrapperService.GetSportName(sportType.ToString(), languageCode);
    }

    public string GetHandicap(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap)
    {
        var choiceBlock = Builder.BuildChoiceBlock(ticket, ticketHelper, ticketData, isShowScoreMap);
        if (choiceBlock.Handicap?.handicap == null || ticket.BetTypeId.IsHideHandicap())
        {
            return string.Empty;
        }

        if (ticket.BetTypeId.IsSabaPromotion())
        {
            return "-";
        }

        var html = choiceBlock.Handicap.handicap;
        var document = new HtmlDocument();
        document.LoadHtml(html);

        return document.DocumentNode.FirstChild?.InnerText;
    }

    public string GetScoreBetListUi(int sportType, bool isLiveIndicator, short liveHomeScore, short liveAwayScore)
    {
        return isLiveIndicator && sportType != SportTypeConstant.Baseball
            ? $"{liveHomeScore} - {liveAwayScore}"
            : string.Empty;
    }
}