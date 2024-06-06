using System.Collections.Generic;
using System.Linq;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.SharedApi.Services.MessageTemplate;

public interface SpecialBetTypeContentService
{
    TemplateContentModel GetContentForVoidPage(IEnumerable<TicketEmailModel> tickets);

    IEnumerable<TemplateContentModel> GetListSpecialBetType(IEnumerable<TicketEmailModel> tickets);
}

public class SpecialBetTypeContentServiceImp : SpecialBetTypeContentService
{
    private readonly BetListService betListService;

    public SpecialBetTypeContentServiceImp(BetListService betListService)
    {
        this.betListService = betListService;
    }

    public TemplateContentModel GetContentForVoidPage(IEnumerable<TicketEmailModel> tickets)
    {
        var specialBetTypeList = GetListSpecialBetType(tickets);
        return new TemplateContentModel
        {
            ContentEnglish = string.Join(", ", specialBetTypeList.Select(x => x.ContentEnglish)),
            ContentChineseTraditional = string.Join(", ", specialBetTypeList.Select(x => x.ContentChineseTraditional)),
            ContentChineseSimplified = string.Join(", ", specialBetTypeList.Select(x => x.ContentChineseSimplified)),
            ContentNewChineseSimplified = string.Join(", ", specialBetTypeList.Select(x => x.ContentNewChineseSimplified))
        };
    }

    public IEnumerable<TemplateContentModel> GetListSpecialBetType(IEnumerable<TicketEmailModel> tickets)
    {
        var ticketsBetList = tickets.Select(x => new Ticket
        {
            BetTypeId = x.IsMixParlay ? x.SubBetType : x.BetTypeId,
            BetId = x.IsMixParlay ? GetBetIdForParlay(x.SubBetCheck) : x.BetId
        }).DistinctBy(x => (x.BetTypeId, x.BetId));

        return ticketsBetList.Select(ticket => new TemplateContentModel
        {
            ContentEnglish = betListService.GetBetTypeName(ticket),
            ContentChineseTraditional = betListService.GetBetTypeNameChineseTraditional(ticket),
            ContentChineseSimplified = betListService.GetBetTypeNameChineseSimplified(ticket),
            ContentNewChineseSimplified = betListService.GetBetTypeNameNewChineseSimplified(ticket)
        });
    }

    private static long? GetBetIdForParlay(string betCheck)
    {
        return long.TryParse(betCheck, out var betCheckNumber) ? betCheckNumber : null;
    }
}