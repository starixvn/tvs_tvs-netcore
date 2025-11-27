using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Client.Helpers.Business;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Criteria.Permission;
using TicketVoidingSystem.SharedApi.Services.Permission;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SharedApi.Handlers.Permission;

public class CheckTicketsStatusRequest : IRequest<SqlResult>
{
    public string ApiKey { get; set; }
    public IEnumerable<BetId> Tickets { get; set; }
    public IEnumerable<BetId> CancelCashOutTickets { get; set; }
    public bool IsHostVoidSettledTickets { get; set; }
    public bool IsHostVoidInstantlySettledTickets { get; set; }
    public bool IsHostVoidUnsettledTickets { get; set; }
    public int? MatchId { get; set; }
    public bool IsCheckForTVS { get; set; }
    public bool? IsCashOutAsUnSettledTicket { get; set; }
}

public class CheckTicketsStatusHandler(
    IDynamicRepository repository,
    IMapper mapper,
    SessionService sessionService,
    CheckTicketsStatusService checkTicketsStatusService)
    : IRequestHandler<CheckTicketsStatusRequest, SqlResult>
{
    public async Task<SqlResult> Handle(CheckTicketsStatusRequest request, CancellationToken cancellationToken)
    {
        var result = request.ApiKey.ToLowerInvariant() switch
        {
            "void-by-bet-id-check-void-bet-permission" => await CheckPermissionVoidByBetId(request),
            "void-single-bet-check-void-bet-permission" => await CheckPermissionVoidSingleBet(request),
            "void-parlay-bet-check-void-bet-permission" => await CheckPermissionVoidParlayBet(request),
            "void-by-currency-check-void-bet-permission" => await CheckPermissionVoidByCurrency(request),
            "void-cash-out-check-void-bet-permission" => await CheckPermissionVoidCashOut(request),
            "ticket-voiding-check-void-bet-permission" => await CheckPermissionTvs(request),
            "mark-tickets-check-permission" => await CheckPermissionMarkTickets(request),
            _ => new SqlResult { ErrCode = 1, ErrMsg = "Invalid request message parameters" }
        };

        return result;
    }

    private async Task<SqlResult> CheckPermissionVoidByBetId(CheckTicketsStatusRequest request)
    {
        var criteria = mapper.Map<CheckVoidBetPermissionVoidByBetIdCriteria>(request);
        criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
        criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host);
        criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        criteria.IsHostVoidOnlyUUSTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        await repository.ExecuteAsync(criteria);
        return CreateSqlResult(criteria);
    }

    private async Task<SqlResult> CheckPermissionVoidSingleBet(CheckTicketsStatusRequest request)
    {
        var criteria = mapper.Map<CheckVoidBetPermissionVoidSingleBetCriteria>(request);
        criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
        criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host);
        criteria.IsHostVoidInstantlySettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host);
        criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host);
        criteria.IsHostVoidOnlyUUSTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        await repository.ExecuteAsync(criteria);
        return CreateSqlResult(criteria);
    }

    private async Task<SqlResult> CheckPermissionVoidParlayBet(CheckTicketsStatusRequest request)
    {
        var criteria = mapper.Map<CheckVoidBetPermissionVoidParlayBetCriteria>(request);
        criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
        criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledParlayBet, Constant.Policy.Host);
        criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledParlayBet, Constant.Policy.Host);
        criteria.IsHostVoidOnlyUUSTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        await repository.ExecuteAsync(criteria);
        return CreateSqlResult(criteria);
    }

    private async Task<SqlResult> CheckPermissionVoidByCurrency(CheckTicketsStatusRequest request)
    {
        var criteria = mapper.Map<CheckVoidBetPermissionVoidByCurrencyCriteria>(request);
        criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
        criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledCurrencyBet, Constant.Policy.Host);
        criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledCurrencyBet, Constant.Policy.Host);
        criteria.IsHostVoidOnlyUUSTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        await repository.ExecuteAsync(criteria);

        return CreateSqlResult(criteria);
    }

    private async Task<SqlResult> CheckPermissionVoidCashOut(CheckTicketsStatusRequest request)
    {
        var criteria = mapper.Map<CheckVoidBetPermissionVoidCashOutTransactionCriteria>(request);
        criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
        criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelSettledCashOut, Constant.Policy.Host);
        criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelUnSettledCashOut, Constant.Policy.Host);
        criteria.IsHostVoidOnlyUUSTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        await repository.ExecuteAsync(criteria);

        return CreateSqlResult(criteria);
    }

    private async Task<SqlResult> CheckPermissionTvs(CheckTicketsStatusRequest request)
    {
        var criteria = mapper.Map<CheckVoidBetPermissionTicketVoidingCriteria>(request);
        criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
        criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host);
        criteria.IsHostVoidInstantlySettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host);
        criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host);
        criteria.IsHostVoidOnlyUUSTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        await repository.ExecuteAsync(criteria);

        return CreateSqlResult(criteria);
    }

    private async Task<SqlResult> CheckPermissionMarkTickets(CheckTicketsStatusRequest request)
    {
        var criteria = mapper.Map<CheckPermissionMarkTicketsCriteria>(request);
        criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
        criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host);
        criteria.IsHostVoidOnlyUUSTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
        await repository.ExecuteAsync(criteria);

        return CreateSqlResult(criteria);
    }

    private static SqlResult CreateSqlResult(CheckVoidBetPermissionCriteria criteria)
    {
        return new SqlResult
        {
            ErrCode = criteria.ErrCode,
            ErrMsg = criteria.ErrMsg
        };
    }
}