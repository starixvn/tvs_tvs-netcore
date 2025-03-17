using Fanex.Data.Repository;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets.VirtualSportsRacing;

public interface HistoryDataService
{
    Task<Result> Insert(IEnumerable<TicketsBetTransModel> tickets);
}

public class HistoryDataServiceImp(SessionService sessionService,
    IDynamicRepository repository, LoggingService loggingService) : HistoryDataService
{
    public async Task<Result> Insert(IEnumerable<TicketsBetTransModel> tickets)
    {
        var infos = CreateXmlObject(tickets);
        if (infos.Rows.Count != 0)
        {
            var xml = FanexCommonConverter.ConvertToXml(infos);
            var criteria = new InsertHistoryDataCriteria { XmlData = xml };
            try
            {
                await repository.ExecuteAsync(criteria);
            }
            catch (Exception exception)
            {
                await LogError(exception, xml);
            }
        }

        return new Result();
    }

    private Root<MaxPayoutModel> CreateXmlObject(IEnumerable<TicketsBetTransModel> tickets)
    {
        return new Root<MaxPayoutModel>
        {
            Rows = tickets.Where(t => t.IsApplyMaxPayout).Select(t => new MaxPayoutModel
            {
                CustId = t.CustId,
                ProductId = t.SportType,
                GroupId = 0,
                LevelId = 255,
                ActionId = 255,
                BetType = t.BetType,
                TransId = t.TransId,
                WinLostDate = t.TransDate,
                CreateBy = sessionService.UserId,
                WinLost = (decimal)t.MaxWinLimit!,
                ActualPayout = (decimal)t.ActualPayout!
            }).ToList()
        };
    }

    private async Task LogError(Exception exception, string xmlTickets)
    {
        var message = $"{nameof(HistoryDataService)}" +
               $"{Environment.NewLine}xml:{Environment.NewLine}{xmlTickets}" +
               $"{Environment.NewLine}Exception:{Environment.NewLine}{exception}";
        await loggingService.ErrorAsync(message);
    }
}