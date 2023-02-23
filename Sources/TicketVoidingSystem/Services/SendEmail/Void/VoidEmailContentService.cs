using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Fanex.MailDeliver.Model;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface VoidEmailContentService
{
    Task<MailRecord> Create(IEnumerable<TicketEmailModel> tickets, EmailGroup group, bool isFromAfterVoidService);
}

public class VoidEmailContentServiceImp : VoidEmailContentService
{
    private readonly TicketService ticketService;
    private readonly IDynamicRepository repository;

    public VoidEmailContentServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<MailRecord> Create(IEnumerable<TicketEmailModel> tickets, EmailGroup group,
        bool isFromAfterVoidService)
    {
        if (model.Valid())
        {
            model.ViewModel.NegativeBalanceUsers = model.GetNegativeBalanceUsers(group, t => t.UserName);
            model.ViewModel.Tickets = await AssignTickets(model.Tickets, model.ViewModel.Match, model.Site, isFromAfterVoidService).ToList();

            var voidType = model.ViewModel.IsLikelyAbnormalBet || model.ViewModel.IsAbnormalAccount || model.ViewModel.IsFilterByUserName ? VoidType.Abnormal : VoidType.None;
            var subject = subjectService.CreateVoid(model, group, voidType);
            var mailRecord = templateEmailService.Create(model, subject);

            return mailRecord.MailRecord;
        }

        return new MailRecord();
    }

    private async Task<IEnumerable<TicketEmailViewModel>> AssignTickets(IEnumerable<TicketEmailModel> ticketModels, Match match, SiteEmail site, bool isFromAfterVoidService)
    {
        var tickets = new List<TicketEmailViewModel>();
        var index = 1;
        var operators = await GetOperators(ticketModels);
        foreach (var item in ticketModels)
        {
            item.OperatorID = operators.FirstOrDefault(x => x.AgentId == item.Recommend).OperatorID;
            var ticket = ticketService.GetTicket(item, match, site, isFromAfterVoidService);
            ticket.No = index++;
            tickets.Add(ticket);
        }

        return tickets;
    }

    private async Task<IEnumerable<GetOperatorInfoModel>> GetOperators(IEnumerable<TicketEmailModel> ticketModels)
    {
        var criteria = new GetOperatorInfoCriteria { AgentIdsXml = ticketModels.Select(x => x.Recommend).Distinct().ToOperatorsXml() };
        return await repository.FetchAsync<GetOperatorInfoModel>(criteria);
    }
}