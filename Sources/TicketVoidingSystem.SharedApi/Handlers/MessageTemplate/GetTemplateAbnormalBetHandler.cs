using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;

namespace TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;

public class GetTemplateAbnormalBetRequest : IRequest<IEnumerable<SubIssueType>>;

public class GetTemplateAbnormalBetHandler(IDynamicRepository repository)
    : IRequestHandler<GetTemplateAbnormalBetRequest, IEnumerable<SubIssueType>>
{
    public async Task<IEnumerable<SubIssueType>> Handle(GetTemplateAbnormalBetRequest request, CancellationToken cancellationToken)
    {
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria()).ConfigureAwait(false);
        var abnormalSubIssueTypes = subIssueTypes.Where(x => x.IssueTypeId == IssueTypeConstant.AbnormalBet)
                                                                        .Where(x => !SubIssueTypeConstant.RemovedList.Contains(x.SubIssueTypeId));

        return abnormalSubIssueTypes;
    }
}