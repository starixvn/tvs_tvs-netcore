using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.SharedApi.Services.MessageTemplate;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface GetInfoTicketsForMessage
{
    public string GetSpecialBetTeam(int betTypeId, IEnumerable<GetTicketModel> allTickets);

    public ContentByLanguageModel GetSpecialBetTypeContent(IEnumerable<GetTicketModel> allTickets);

    public string GetHdpValues(int betTypeId, IEnumerable<GetTicketModel> allTickets);

    public Task<string> GetAllNumberInnings(IEnumerable<GetTicketModel> voidTickets, int issueTypeId, int? matchId);
}

public class GetInfoTicketsForMessageImp(SpecialBetTypeContentService specialBetTypeContentService, BetTypesRepository betTypesRepository) : GetInfoTicketsForMessage
{
    public string GetSpecialBetTeam(int betTypeId, IEnumerable<GetTicketModel> allTickets)
    {
        List<int> SpecialBetTypes = [BetTypeConstant.OverUnder, BetTypeConstant.FirstHalfOverUnder];
        if (!SpecialBetTypes.Contains(betTypeId) && !IsGroupBetTypeHandicap(allTickets))
        {
            return string.Empty;
        }

        var betTeams = allTickets
            .Select(ticket => ticket.IsMixParlay ? ticket.SubBetTeam.ToLowerInvariant() : ticket.BetTeam.ToLowerInvariant())
            .Distinct().ToList();

        return betTeams.Count > 1 ? "All" : betTeams.FirstOrDefault();
    }

    public ContentByLanguageModel GetSpecialBetTypeContent(IEnumerable<GetTicketModel> allTickets)
    {
        var emailTickets = allTickets.Select(x => new TicketEmailModel
        {
            IsMixParlay = x.IsMixParlay,
            BetTypeId = x.BetType,
            BetId = x.BetId,
            SubBetType = x.SubBetType,
            SubBetCheck = x.SubBetCheck
        });

        return specialBetTypeContentService.GetContentForVoidPage(emailTickets);
    }

    private static string GetHdpValuesOverUnder(IEnumerable<GetTicketModel> allTickets)
    {
        var inputOver = allTickets.Select(ticket => Math.Abs(ticket.IsMixParlay ? ticket.SubHdp1 : ticket.Hdp1)).Distinct();

        return string.Join(", ", inputOver);
    }

    private static string GetHdpValuesHandicap(IEnumerable<GetTicketModel> allTickets)
    {
        var hdpValues = allTickets.Select(ticket =>
            Math.Abs(ticket.IsMixParlay ? ticket.SubHdp1 + ticket.SubHdp2 : ticket.Hdp1 + ticket.Hdp2)).Distinct();

        return string.Join(", ", hdpValues);
    }

    public string GetHdpValues(int betTypeId, IEnumerable<GetTicketModel> allTickets)

    {
        if (betTypeId is BetTypeConstant.OverUnder or BetTypeConstant.FirstHalfOverUnder)
        {
            return GetHdpValuesOverUnder(allTickets);
        }

        return IsGroupBetTypeHandicap(allTickets) ? GetHdpValuesHandicap(allTickets) : string.Empty;
    }

    protected virtual bool IsGroupBetTypeHandicap(IEnumerable<GetTicketModel> allTickets)
    {
        return allTickets.All(x => x.GroupBetTypeId is BetTypeConstant.Handicap);
    }

    public async Task<string> GetAllNumberInnings(IEnumerable<GetTicketModel> voidTickets, int issueTypeId, int? matchId)
    {
        if (issueTypeId is not IssueTypeConstant.MatchEarlyCompleted)
        {
            return null;
        }

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