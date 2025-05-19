using AutoMapper;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet.Services.GetTickets;

public interface UpdateListTicketsViewModelService
{
    Task Update(ListTicketsViewModel model, IList<GetTicketModel> data, int matchId, int issueTypeId);
}

public class UpdateListTicketsViewModelServiceImp(IMapper mapper,
    BetListService betListService,
    BetTypesRepository betTypesRepository)
    : UpdateListTicketsViewModelService
{
    public async Task Update(ListTicketsViewModel model, IList<GetTicketModel> data, int matchId, int issueTypeId)
    {
        if (!data.Any())
        {
            return;
        }

        model.TotalItems = data.Count;
        model.SingleCount = data.Count(item => !item.IsMixParlay);
        model.ParlayCount = data.Count(item => item.IsMixParlay);
        model.LicenseeAffectedList = GetLicenseeAffectedList(data);
        UpdateTimeViewModel(model, data);
        UpdateBetTypeName(model, data);
        await UpdateSmallestMapTicket(model, data, matchId);
        model.Inning = await GetAllNumberInnings(data, matchId);
    }

    private static List<AffectedLicensee> GetLicenseeAffectedList(IList<GetTicketModel> data)
    {
        var instantLicensee = data.Where(item => item.IsInstantSettlement && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var timeMachineLicensee = data.Where(item => item.BetType.IsSabaTimeMachine() && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var cashOutLicensee = data.Where(item => item.IsCashOut && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var chinaViewLicensee = data.Where(item => item.IsChinaView).Select(item => item.LicenseeName).Distinct().ToArray();
        var jollyViewLicensee = data.Where(item => item.SpecialPlatform == SpecialPlatformConstant.JollySports).Select(item => item.LicenseeName).Distinct().ToArray();
        var jollySportsCvLicensee = data.Where(item => item.SpecialPlatform == SpecialPlatformConstant.JollySportsCv).Select(item => item.LicenseeName).Distinct().ToArray();
        var licensees = data.Where(item => item.IsDeposit && !chinaViewLicensee.Contains(item.LicenseeName) && !jollyViewLicensee.Contains(item.LicenseeName)
                                           && !jollySportsCvLicensee.Contains(item.LicenseeName)).Select(item => item.LicenseeName).Distinct().ToArray();

        Array.Sort(licensees, StringComparer.InvariantCulture);
        Array.Sort(instantLicensee, StringComparer.InvariantCulture);
        Array.Sort(cashOutLicensee, StringComparer.InvariantCulture);
        Array.Sort(chinaViewLicensee, StringComparer.InvariantCulture);
        Array.Sort(jollyViewLicensee, StringComparer.InvariantCulture);
        Array.Sort(jollySportsCvLicensee, StringComparer.InvariantCulture);
        Array.Sort(timeMachineLicensee, StringComparer.InvariantCulture);

        var licenseeAffectedList = new AffectedLicenseeList();
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.Normal].LicenseesName = string.Join(", ", licensees);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.Instant].LicenseesName = string.Join(", ", instantLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.CashOut].LicenseesName = string.Join(", ", cashOutLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.ChinaView].LicenseesName = string.Join(", ", chinaViewLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.JollyView].LicenseesName = string.Join(", ", jollyViewLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.JollySportCv].LicenseesName = string.Join(", ", jollySportsCvLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.TimeMachine].LicenseesName = string.Join(", ", timeMachineLicensee);

        return licenseeAffectedList.LicenseeAffectedList;
    }

    private static void UpdateTimeViewModel(ListTicketsViewModel model, IList<GetTicketModel> data)
    {
        model.FromTransTime = data.Min(item => item.TransDate).ZoneManila();
        model.ToTransTime = data.Max(item => item.TransDate).ZoneManila();
        model.FromCheckTime = data.Min(item => item.CheckTime).ZoneManila();
        model.ToCheckTime = data.Max(item => item.CheckTime).ZoneManila();
    }

    private void UpdateBetTypeName(ListTicketsViewModel model, IList<GetTicketModel> data)
    {
        var ticket = data[0].IsMixParlay ? CreateSubTicketBetList(data[0]) : CreateTicketBetList(data[0]);
        model.BetTypeNameReplaceMessage = new ContentByLanguageModel
        {
            ContentEnglish = betListService.GetBetTypeName(ticket),
            ContentChineseTraditional = betListService.GetBetTypeNameChineseTraditional(ticket),
            ContentChineseSimplified = betListService.GetBetTypeNameChineseSimplified(ticket),
            ContentNewChineseSimplified = betListService.GetBetTypeNameNewChineseSimplified(ticket)
        };
    }

    private Ticket CreateTicketBetList(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetTypeId = item.BetType;
        ticket.BetId = item.BetId;

        return ticket;
    }

    private Ticket CreateSubTicketBetList(GetTicketModel item)
    {
        var ticket = mapper.Map<Ticket>(item);
        ticket.BetId = default;
        ticket.OddsType = string.Empty;
        ticket.BetCheck = item.SubBetCheck;
        ticket.BetTypeId = item.SubBetType;
        ticket.BetTeam = item.SubBetTeam;
        ticket.Handicap1 = item.SubHdp1;
        ticket.Handicap2 = item.SubHdp2;
        ticket.Odds = item.SubOdds;

        return ticket;
    }

    private async Task UpdateSmallestMapTicket(ListTicketsViewModel model, IEnumerable<GetTicketModel> tickets, int matchId)
    {
        var betTypesModel = await betTypesRepository.GetBetTypes(new GetBetTypesCriteria
        {
            MatchId = matchId,
            BetTypes = string.Join(",", tickets.Select(x => x.BetType).Distinct())
        });
        var allBetTypesMap = betTypesModel.BetTypes.Where(y => y.Name.StartsWith("Map X")).Select(x => int.Parse(x.Id));
        var minBetId = tickets.Where(x => allBetTypesMap.Contains(x.BetType)).Min(x => x.BetId)?.ToString();
        var minValueMap = minBetId.SubstringBypassLength(1, 2);

        model.SmallestMapTicket = int.TryParse(minValueMap, out var value) ? value.ToString() : "";
    }

    private async Task<string> GetAllNumberInnings(IEnumerable<GetTicketModel> voidTickets, int? matchId)
    {
        var betTypesModel = await betTypesRepository.GetBetTypes(new GetBetTypesCriteria
        {
            MatchId = matchId ?? 0,
            BetTypes = string.Join(",", voidTickets.Select(x => x.BetType).Distinct())
        });
        var allBetTypesInning = betTypesModel.BetTypes.Where(y => y.Name.Contains("X Inning")).Select(x => int.Parse(x.Id));
        var betIdStrings = voidTickets
            .Where(x => allBetTypesInning.Contains(x.BetType))
            .Select(x => x.IsMixParlay ? x.SubBetCheck?.ToString() : x.BetId.ToString())
            .ToList();
        var inningValues = betIdStrings.Select(x => x.SubstringBypassLength(1, 2));

        return string.Join(",", inningValues
            .Select(x => int.TryParse(x, out var value) ? value.ToString() : null).Distinct()
            .Where(x => x != null));
    }
}