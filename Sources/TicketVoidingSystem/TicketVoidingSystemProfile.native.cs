using AutoMapper;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem;

public class TicketVoidingSystemProfile : Profile
{
    public TicketVoidingSystemProfile()
    {
        CreateMap<TicketEmailModel, Ticket>();
        CreateMap<TicketRecoverEmailModel, Ticket>();
    }
}