using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.VoidByBetId;

public class VoidByBetIdProfile : Profile
{
    public VoidByBetIdProfile()
    {
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<VoidTicketsQuery, EmailVoidModel>();
        CreateMap<GetTicketsQuery, GetTicketsCriteria>();
        CreateMap<VoidTicketsQuery, TicketInfoForLetstalk>();
    }
}