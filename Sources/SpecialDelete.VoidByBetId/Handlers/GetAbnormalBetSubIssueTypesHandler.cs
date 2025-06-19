using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;

namespace SpecialDelete.VoidByBetId.Handlers;

public class GetAbnormalBetSubIssueTypesRequest : IRequest<IEnumerable<SubIssueType>>;

public class GetAbnormalBetSubIssueTypesHandler(IDynamicRepository repository)
    : IRequestHandler<GetAbnormalBetSubIssueTypesRequest, IEnumerable<SubIssueType>>
{
    public async Task<IEnumerable<SubIssueType>> Handle(GetAbnormalBetSubIssueTypesRequest request, CancellationToken cancellationToken)
    {
        var subIssueTypes = await repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria()).ConfigureAwait(false);
        var abnormalSubIssueTypes = subIssueTypes.Where(x => x.IssueTypeId == IssueTypeConstant.AbnormalBet)
            .Where(x => !SubIssueTypeConstant.RemovedList.Contains(x.SubIssueTypeId));

        return abnormalSubIssueTypes;
    }
}