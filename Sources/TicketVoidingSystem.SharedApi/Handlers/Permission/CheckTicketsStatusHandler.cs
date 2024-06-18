using System;
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

public class CheckTicketsStatusHandler : IRequestHandler<CheckTicketsStatusRequest, SqlResult>
{
    private readonly IDynamicRepository repository;
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly CheckTicketsStatusService checkTicketsStatusService;

    public CheckTicketsStatusHandler(IDynamicRepository repository, IMapper mapper, SessionService sessionService, CheckTicketsStatusService checkTicketsStatusService)
    {
        this.repository = repository;
        this.mapper = mapper;
        this.sessionService = sessionService;
        this.checkTicketsStatusService = checkTicketsStatusService;
    }

    public async Task<SqlResult> Handle(CheckTicketsStatusRequest request, CancellationToken cancellationToken)
    {
        if (request.ApiKey.Equals("void-by-bet-id-check-void-bet-permission", StringComparison.InvariantCultureIgnoreCase))
        {
            var criteria = mapper.Map<CheckVoidBetPermissionVoidByBetIdCriteria>(request);
            criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
            criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host);
            criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host);
            await repository.ExecuteAsync(criteria);
            return CreateSqlResult(criteria);
        }

        if (request.ApiKey.Equals("void-single-bet-check-void-bet-permission", StringComparison.InvariantCultureIgnoreCase))
        {
            var criteria = mapper.Map<CheckVoidBetPermissionVoidSingleBetCriteria>(request);
            criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
            criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledSingleBet, Constant.Policy.Host);
            criteria.IsHostVoidInstantlySettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledAndInstantlySettledSingleBet, Constant.Policy.Host);
            criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledSingleBet, Constant.Policy.Host);
            await repository.ExecuteAsync(criteria);
            return CreateSqlResult(criteria);
        }

        if (request.ApiKey.Equals("void-parlay-bet-check-void-bet-permission", StringComparison.InvariantCultureIgnoreCase))
        {
            var criteria = mapper.Map<CheckVoidBetPermissionVoidParlayBetCriteria>(request);
            criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
            criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledParlayBet, Constant.Policy.Host);
            criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnSettledParlayBet, Constant.Policy.Host);
            await repository.ExecuteAsync(criteria);
            return CreateSqlResult(criteria);
        }

        if (request.ApiKey.Equals("void-by-currency-check-void-bet-permission", StringComparison.InvariantCultureIgnoreCase))
        {
            var criteria = mapper.Map<CheckVoidBetPermissionVoidByCurrencyCriteria>(request);
            criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
            criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledCurrencyBet, Constant.Policy.Host);
            criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledCurrencyBet, Constant.Policy.Host);
            await repository.ExecuteAsync(criteria);
            return CreateSqlResult(criteria);
        }

        if (request.ApiKey.Equals("void-cash-out-check-void-bet-permission", StringComparison.InvariantCultureIgnoreCase))
        {
            var criteria = mapper.Map<CheckVoidBetPermissionVoidCashOutTransactionCriteria>(request);
            criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
            criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelSettledCashOut, Constant.Policy.Host);
            criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.CancelUnSettledCashOut, Constant.Policy.Host);
            await repository.ExecuteAsync(criteria);
            return CreateSqlResult(criteria);
        }

        if (request.ApiKey.Equals("ticket-voiding-check-void-bet-permission", StringComparison.InvariantCultureIgnoreCase))
        {
            var criteria = mapper.Map<CheckVoidBetPermissionTicketVoidingCriteria>(request);
            criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
            criteria.IsHostVoidSettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingSettledTickets, Constant.Policy.Host);
            criteria.IsHostVoidInstantlySettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingInstantlySettled, Constant.Policy.Host);
            criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.TicketVoidingUnsettledTickets, Constant.Policy.Host);
            await repository.ExecuteAsync(criteria);
            return CreateSqlResult(criteria);
        }

        if (request.ApiKey.Equals("mark-tickets-check-permission", StringComparison.InvariantCultureIgnoreCase))
        {
            var criteria = mapper.Map<CheckPermissionMarkTicketsCriteria>(request);
            criteria.TransInfoJson = await checkTicketsStatusService.GetTransInfoJsonForCheckPermission(request);
            criteria.IsHostVoidUnsettledTickets = await sessionService.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host);
            await repository.ExecuteAsync(criteria);
            return CreateSqlResult(criteria);
        }

        return new SqlResult { ErrCode = 1, ErrMsg = "Invalid request message parameters" };
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