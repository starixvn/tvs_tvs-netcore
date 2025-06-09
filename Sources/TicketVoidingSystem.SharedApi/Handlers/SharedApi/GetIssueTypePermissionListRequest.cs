using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

using Fanex.NAP.Client.Helpers.Business;

public class GetIssueTypePermissionListRequest : IRequest<IEnumerable<IssueType>>;

public class GetIssueTypePermissionListHandler(SessionService sessionService)
    : IRequestHandler<GetIssueTypePermissionListRequest, IEnumerable<IssueType>>
{
    public async Task<IEnumerable<IssueType>> Handle(GetIssueTypePermissionListRequest request, CancellationToken cancellationToken)
    {
        var issueTypeHasPermission = await sessionService.GetPermissionsAsync(SpecialDeleteFunctionKeys.TicketVoidingManageByIssue, Constant.Policy.Read);

        return IssueTypeFunctionKeysConstant.IssueTypeFunctionKeyList
            .Where(x => issueTypeHasPermission.Any(y => string.Equals(y.Key, x.FunctionKey, StringComparison.OrdinalIgnoreCase)))
            .Select(x => x.IssueType).OrderBy(x => x.IssueTypeName);
    }
}