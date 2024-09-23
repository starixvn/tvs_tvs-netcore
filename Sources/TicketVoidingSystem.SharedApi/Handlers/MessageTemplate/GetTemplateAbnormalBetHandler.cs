using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.MessageTemplate;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;

namespace TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;

public class GetTemplateAbnormalBetRequest : IRequest<object>
{
}

public class GetTemplateAbnormalBetHandler : IRequestHandler<GetTemplateAbnormalBetRequest, object>
{
    private readonly IDynamicRepository repository;

    public GetTemplateAbnormalBetHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<object> Handle(GetTemplateAbnormalBetRequest request, CancellationToken cancellationToken)
    {
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria()).ConfigureAwait(false);
        var templateSettings = await repository.FetchAsync<TemplateSetting>(new GetTemplateSettingCriteria()).ConfigureAwait(false);
        var templates = await repository.FetchAsync<TemplateModel>(new GetTemplatesCriteria()).ConfigureAwait(false);

        var abnormalIssueType = new IssueType { IssueTypeId = IssueTypeConstant.AbnormalBet };
        var abnormalSubIssueTypes = subIssueTypes.Where(x => x.IssueTypeId == IssueTypeConstant.AbnormalBet)
                                                                        .Where(x => !SubIssueTypeConstant.RemovedList.Contains(x.SubIssueTypeId));
        var abnormalTemplateSettings = templateSettings.Where(x => abnormalSubIssueTypes.Any(s => s.SubIssueTypeId == x.SubIssueTypeId));
        var abnormalTemplates = templates.Where(x => abnormalTemplateSettings.Any(s => s.TemplateId == x.TemplateId));

        return new
        {
            IssueType = abnormalIssueType,
            SubIssueTypes = abnormalSubIssueTypes,
            TemplateSettings = abnormalTemplateSettings,
            Templates = abnormalTemplates
        };
    }
}