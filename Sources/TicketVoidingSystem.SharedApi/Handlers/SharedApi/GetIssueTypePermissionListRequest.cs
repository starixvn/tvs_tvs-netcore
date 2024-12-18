using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

using Fanex.NAP.Client.Helpers.Business;

public class GetIssueTypePermissionListRequest : IRequest<IEnumerable<IssueType>>;

public class GetIssueTypePermissionListHandler(SessionService sessionService)
    : IRequestHandler<GetIssueTypePermissionListRequest, IEnumerable<IssueType>>
{
    public async Task<IEnumerable<IssueType>> Handle(GetIssueTypePermissionListRequest request, CancellationToken cancellationToken)
    {
        var issueTypePermissionList = new List<IssueType>();

        foreach (var item in IssueTypeFunctionKeysConstant.IssueTypeFunctionKeyList)
        {
            if (await sessionService.HasPermission(item.FunctionKey, Constant.Policy.Read))
            {
                issueTypePermissionList.Add(item.IssueType);
            }
        }
        var sortedFunctionKeys = issueTypePermissionList.OrderBy(x => x.IssueTypeName).ToList();

        return sortedFunctionKeys;
    }
}