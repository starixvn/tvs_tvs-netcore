using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;
using TicketVoidingSystem.Models.Letstalk;

namespace SpecialDelete.VoidByBetId;

public class VoidByBetIdProfile : Profile
{
    public VoidByBetIdProfile()
    {
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<GetTicketsQuery, GetTicketsCriteria>();
        CreateMap<VoidTicketsQuery, TicketInfoForLetstalk>();
    }
}