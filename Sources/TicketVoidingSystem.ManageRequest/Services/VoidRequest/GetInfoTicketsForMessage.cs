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
}

public class GetInfoTicketsForMessageImp : GetInfoTicketsForMessage
{
    private readonly SpecialBetTypeContentService specialBetTypeContentService;

    public GetInfoTicketsForMessageImp(SpecialBetTypeContentService specialBetTypeContentService)
    {
        this.specialBetTypeContentService = specialBetTypeContentService;
    }

    public string GetInputOverUnder(int betTypeId, IEnumerable<GetTicketModel> allTickets)
    {
        if (betTypeId is not (BetTypeConstant.OverUnder or BetTypeConstant.FirstHalfOverUnder))
        {
            return string.Empty;
        }

        var inputOver = allTickets.Select(x => Math.Abs(x.Hdp1)).Distinct();

        return string.Join(", ", inputOver);
    }

    public string GetSpecialBetTeam(int betTypeId, IEnumerable<GetTicketModel> allTickets)
    {
        var SpecialBetTypes = new List<int>
        {
            BetTypeConstant.Handicap, BetTypeConstant.FirstHalfHandicap, BetTypeConstant.OverUnder, BetTypeConstant.FirstHalfOverUnder
        };

        if (!SpecialBetTypes.Contains(betTypeId))
        {
            return string.Empty;
        }

        var betTeams = allTickets.Select(ticket => ticket.IsMixParlay ? ticket.SubBetTeam : ticket.BetTeam).Distinct();

        return betTeams.Count() > 1 ? "All" : betTeams.FirstOrDefault();
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
}