using System;
using System.Threading.Tasks;
using Fanex.NAP.Client.Helpers.Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.Web;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
public class IssueTypeAuthAttribute(string issueTypeKey, Constant.Policy policy)
    : Attribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var authorizationService = context.HttpContext.RequestServices.GetRequiredService<IAuthorizationService>();
        var user = context.HttpContext.User;
        var requirement = new IssueTypeAuthorizationRequirement(issueTypeKey, policy);
        var authResult = await authorizationService.AuthorizeAsync(user, null, requirement);

        if (!authResult.Succeeded)
        {
            context.Result = new RedirectToActionResult("AccessDenied", "Home", null);
        }
    }
}

public class IssueTypeAuthorizationRequirement(string issueTypeKey, Constant.Policy policy) : IAuthorizationRequirement
{
    public string IssueTypeKey { get; } = issueTypeKey;
    public Constant.Policy Policy { get; } = policy;
}

public class IssueTypeAuthorizationHandler(SessionService sessionService)
    : AuthorizationHandler<IssueTypeAuthorizationRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IssueTypeAuthorizationRequirement requirement)
    {
        try
        {
            var hasPermission = await sessionService.HasPermission(requirement.IssueTypeKey, requirement.Policy);

            if (hasPermission)
            {
                context.Succeed(requirement);
            }
        }
        catch (Exception ex)
        {
#pragma warning disable S106
            var errorMsg = $"Error in IssueTypeAuthorizationHandler: {ex.Message}";
            Console.WriteLine(errorMsg);
#pragma warning restore S106
        }
    }
}