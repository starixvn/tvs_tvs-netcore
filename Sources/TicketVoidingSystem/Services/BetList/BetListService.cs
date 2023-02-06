using System.Collections.Generic;
using Fanex.BetList.Core.Builder;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.Factories;
using Fanex.BetList.Core.Templates;
using Fanex.BetList.Core.TicketHelper;
using HtmlAgilityPack;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace TicketVoidingSystem.Services.BetList
{
    public interface BetListService
    {
        Choice_Template BuildChoiceBlock(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);

        string BuildChoice(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);

        string BuildChoiceExcel(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);

        string BuildStake(ITicket ticket, ITicketHelper ticketHelper);

        string GetOdds(ITicket ticket, bool isParlay);

        string GetBetType(object betTypeId, string language);

        string GetBetTypeName(ITicket ticket);

        string GetBetTypeNameChineseSimplified(ITicket ticket);

        string GetBetTypeNameChineseTraditional(ITicket ticket);

        string GetBetTypeNameNewChineseSimplified(ITicket ticket);

        string GetBetTypeName(int id, long refNo);

        string GetBetTeam(Choice_Template choice);

        string GetStatus(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowVnIp);

        string GetComboParlayName(ITicket ticket);

        string[] GetComboName(string betTeam, string betCheck, decimal handicap1, decimal handicap2);

        string GetMatchCodeBetradar(string matchCode);

        string GetSportTypeName(int sportType, string languageCode);

        string GetHandicap(ITicket ticket, ITicketHelper ticketHelper, List<ITicketData> ticketData, bool isShowScoreMap);
    }

    public class BetListServiceImp : BetListService
    {
        private readonly OddsService oddsService;
        private readonly RemotingRefWrapperService remotingRefWrapperService;

        public BetListServiceImp(RemotingRefWrapperService remotingRefWrapperService, OddsService oddsService)
        {
            this.remotingRefWrapperService = remotingRefWrapperService;
            this.oddsService = oddsService;
        }

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
            return string.IsNullOrWhiteSpace(oddName)
                ? oddHtml.Replace("<br />", " ") : oddHtml.Replace("<br />", " (") + ")";
        }

        public string GetBetType(object betTypeId, string language)
        {
            return remotingRefWrapperService.GetBetType(betTypeId, language);
        }

        public string GetBetTypeName(ITicket ticket)
        {
            var ticketHelper = new TicketHelper(new LanguageCacheRef(LanguageCode.English));
            var factory = new BetListBaseBuilder();
            var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
            return builder.GetBetTypeName(ticket, ticketHelper);
        }

        public string GetBetTypeNameChineseSimplified(ITicket ticket)
        {
            var ticketHelper = new TicketHelper(new LanguageCacheRef(LanguageCode.ChineseSimplified));
            var factory = new BetListBaseBuilder();
            var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
            var betTypeName = builder.GetBetTypeName(ticket, ticketHelper);

            return betTypeName.TranslateChineseSimplified();
        }

        public string GetBetTypeNameChineseTraditional(ITicket ticket)
        {
            var ticketHelper = new TicketHelper(new LanguageCacheRef(LanguageCode.ChineseTraditional));
            var factory = new BetListBaseBuilder();
            var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
            var betTypeName = builder.GetBetTypeName(ticket, ticketHelper);

            return betTypeName;
        }

        public string GetBetTypeNameNewChineseSimplified(ITicket ticket)
        {
            var ticketHelper = new TicketHelper(new LanguageCacheRef(LanguageCode.NewChineseSimplified));
            var factory = new BetListBaseBuilder();
            var builder = factory.CreateChoiceBuilder(ticket.BetTypeId);
            var betTypeName = builder.GetBetTypeName(ticket, ticketHelper);

            return betTypeName;
        }

        public string GetBetTypeName(int id, long refNo)
        {
            var betTypeId = remotingRefWrapperService.GetParentIdByBetTypeId(id);
            if (string.IsNullOrWhiteSpace(betTypeId))
            {
                betTypeId = id.ToString();
            }

            var betName = remotingRefWrapperService.GetBetType(betTypeId, refNo);
            const int FistNextBet = 86;
            const int SecondNextBet = 85;
            return id == FistNextBet || id == SecondNextBet ? $"Next {betName}" : betName;
        }

        public string GetBetTeam(Choice_Template choice)
        {
            var temp = choice;
            temp.ScoreMapIcon = null;
            temp.BetType = null;
            temp.Match = null;
            temp.League = null;
            temp.Handicap = null;
            temp.Score = null;

            return temp;
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
                html = comboNames?[i] == string.Empty ?
                    html : html + $" <div><span class='combo-name'>{comboNames?[i]}</span></div>";
            }

            return html;
        }

        public string[] GetComboName(string betTeam, string betCheck, decimal handicap1, decimal handicap2)
        {
            return remotingRefWrapperService.GetComboParlayName(betTeam, betCheck, handicap1, handicap2);
        }

        public string GetMatchCodeBetradar(string matchCode)
        {
            return remotingRefWrapperService.GetMatchCodeBetRadar(matchCode);
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

            var html = choiceBlock.Handicap.handicap;
            var document = new HtmlDocument();
            document.LoadHtml(html);

            return document.DocumentNode.FirstChild?.InnerText;
        }
    }
}