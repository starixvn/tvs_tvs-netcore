namespace TicketVoidingSystem.MarkTickets.Services.ExportExcel
{
    using System.Collections.Generic;
    using System.Drawing;
    using AutoMapper;
    using Constants;
    using Criteria;
    using Fanex.NAP.Core.Business;
    using GetTickets;
    using Models;
    using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;

    public interface ISheetService
    {
        string CreateTitle(int matchId);

        void AddMatch(ExcelWorksheet worksheet, Match match);

        List<ExcelTicketModel> GetTickets(GetTicketsQuery query);

        List<ExcelTicketModel> GetDetailTickets(GetDetailTicketsQuery query);

        void SetStyle(ExcelWorksheet worksheet);
    }

    public class SheetService : ISheetService
    {
        private readonly IGetTicketsService getTicketsService;
        private readonly ITicketService ticketService;
        private readonly ISessionService sessionService;

        public SheetService(
            IGetTicketsService getTicketsService,
            ITicketService ticketHtmlService,
            ISessionService sessionService)
        {
            this.getTicketsService = getTicketsService;
            ticketService = ticketHtmlService;
            this.sessionService = sessionService;
        }

        public string CreateTitle(int matchId)
        {
            return $"Mark/ Unmark tickets - MatchId: {matchId}";
        }

        public void AddMatch(ExcelWorksheet worksheet, Match match)
        {
            const int row = 5;
            const int matchCodeCol = 1;
            const int eventTimeCol = 4;
            const int matchEventCol = 2;
            var eventTime = match.EventDate.ToString(FormatKey.ShortDateFormatWithSlash);
            worksheet.Cells[row, matchCodeCol].Value = match.MatchCode;
            worksheet.Cells[row, matchEventCol].Value = match.MatchEvent;
            worksheet.Cells[row, eventTimeCol].Value = eventTime;
        }

        public List<ExcelTicketModel> GetTickets(GetTicketsQuery query)
        {
            var getTicketsResult = getTicketsService.GetTickets(query);
            var tickets = AssignDataToExcelModel(getTicketsResult.Tickets);

            return tickets;
        }

        public List<ExcelTicketModel> GetDetailTickets(GetDetailTicketsQuery query)
        {
            var data = getTicketsService.GetDetailTickets(query);
            var tickets = AssignDataToExcelModel(data);

            return tickets;
        }

        public void SetStyle(ExcelWorksheet worksheet)
        {
            worksheet.Cells.Style.WrapText = true;
            var lastRow = worksheet.Dimension.End.Row;
            worksheet.HighlightBackground($"A8:J{lastRow}", "MOD(ROW(),2)>0", Color.LemonChiffon);
            worksheet.HighlightFont($"F8:F{lastRow}", "LEFT(F8,1)=\"-\"", Color.Red);
        }

        private List<ExcelTicketModel> AssignDataToExcelModel(IEnumerable<GetTicketModel> data)
        {
            var index = 1;
            var tickets = new List<ExcelTicketModel>();
            var canViewUserName = sessionService.HasPermission(SpecialDeleteFunctionKeys.ViewUsernameofSpecialSiteonBetList, Constant.Policy.Read);
            foreach (var item in data)
            {
                var ticketDetail = ticketService.Render(item);
                var ticket = Mapper.Map<ExcelTicketModel>(ticketDetail);
                ticket.No = index++;
                ticket.BetId = ticketDetail.BetId.LineBreak();
                ticket.Member = !canViewUserName && item.GroupName == SpecialSiteConstant.Site789Y ? "-".LineBreak() : ticketDetail.Member.LineBreak();
                ticket.Currency = !canViewUserName && item.GroupName == SpecialSiteConstant.Site789Y ? "-".LineBreak() : ticketDetail.Currency.LineBreak();
                ticket.Odds = ticketDetail.Odds.DefaultText();
                ticket.Stake = ticketDetail.Stake.StakeText();
                ticket.Status = ticketDetail.Status.DefaultText();
                ticket.Choice = ticketDetail.Choice.ChoiceSubParlay(item.IsMixParlay);
                tickets.Add(ticket);
            }

            return tickets;
        }
    }
}