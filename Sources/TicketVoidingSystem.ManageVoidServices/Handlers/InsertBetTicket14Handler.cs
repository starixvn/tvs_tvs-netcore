using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Helper = TicketVoidingSystem.Utilities.Helper;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class InsertBetTicket14Request : InsertBetTicket14Criteria, IRequest<InsertBetTicket14ResultModel>;

public class InsertBetTicket14Handler(OnlineServerRepository onlineServerRepository, LoggingService loggingService)
    : IRequestHandler<InsertBetTicket14Request, InsertBetTicket14ResultModel>
{
    public async Task<InsertBetTicket14ResultModel> Handle(InsertBetTicket14Request request, CancellationToken cancellationToken)
    {
        try
        {
            var results = await onlineServerRepository.FetchAsync<InsertBetTicket14ResultModel>(request);

            return new InsertBetTicket14ResultModel
            {
                InvalidTransIds = Helper.GetIntersectTransIdString(results.Select(x => x.InvalidTransIds)),
                BalanceUpTransIds = Helper.GetIntersectTransIdString(results.Select(x => x.BalanceUpTransIds))
            };
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e.Message, e);
            return new InsertBetTicket14ResultModel
            {
                ErrorCode = ExecuteStatus.Failed,
                ErrorMsg = e.Message
            };
        }
    }
}