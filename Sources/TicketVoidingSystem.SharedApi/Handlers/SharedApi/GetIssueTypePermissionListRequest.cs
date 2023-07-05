using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.NAP.Core.Business;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetIssueTypePermissionListRequest : IRequest<IEnumerable<IssueType>>
{
}

public class GetIssueTypePermissionListHandler : IRequestHandler<GetIssueTypePermissionListRequest, IEnumerable<IssueType>>
{
    private readonly SessionService sessionService;

    public GetIssueTypePermissionListHandler(SessionService sessionService)
    {
        this.sessionService = sessionService;
    }

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

        return issueTypePermissionList;
    }
}