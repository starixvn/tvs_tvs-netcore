using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.SharedApi.Services.MessageTemplate;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface GetInfoTicketsForMessage
{
    public string GetInputOverUnder(int betTypeId, IEnumerable<GetTicketModel> allTickets);

    public string GetSpecialBetTeam(int betTypeId, IEnumerable<GetTicketModel> allTickets);

    public ContentByLanguageModel GetSpecialBetTypeContent(IEnumerable<GetTicketModel> allTickets);

    public string GetHdpValues(int betTypeId, IEnumerable<GetTicketModel> allTickets);
}

public class GetInfoTicketsForMessageImp(SpecialBetTypeContentService specialBetTypeContentService)
    : GetInfoTicketsForMessage
{
    public string GetSpecialBetTeam(int betTypeId, IEnumerable<GetTicketModel> allTickets)
    {
        List<int> SpecialBetTypes = [BetTypeConstant.Handicap, BetTypeConstant.FirstHalfHandicap, BetTypeConstant.OverUnder, BetTypeConstant.FirstHalfOverUnder];
        if (!SpecialBetTypes.Contains(betTypeId))
        {
            return string.Empty;
        }

        var betTeams = allTickets.Select(ticket => ticket.IsMixParlay ? ticket.SubBetTeam : ticket.BetTeam).Distinct().ToList();

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
        return betTypeId switch
        {
            BetTypeConstant.OverUnder or BetTypeConstant.FirstHalfOverUnder => GetHdpValuesOverUnder(allTickets),
            BetTypeConstant.Handicap or BetTypeConstant.FirstHalfHandicap => GetHdpValuesHandicap(allTickets),
            _ => string.Empty
        };
    }
}