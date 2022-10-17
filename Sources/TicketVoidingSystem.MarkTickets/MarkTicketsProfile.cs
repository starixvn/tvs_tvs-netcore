using AutoMapper;
using TicketVoidingSystem.MarkTickets.Criteria;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;

namespace TicketVoidingSystem.MarkTickets
{
    public class MarkTicketsProfile : Profile
    {
        public MarkTicketsProfile()
        {
            CreateMap<GetTicketsQuery, GetTicketsCriteria>();
            CreateMap<GetDetailTicketsQuery, GetDetailTicketsCriteria>();
            CreateMap<AllMarkedTicketsQuery, AllMarkedTicketsCriteria>();
            CreateMap<GetUserLogsQuery, GetUserLogsCriteria>();
            //CreateMap<GetTicketModel, Ticket>();
            CreateMap<MarkTicketsQuery, MarkTicketsCommand>();
            CreateMap<MarkAllTicketsQuery, MarkAllTicketsCommand>();
            CreateMap<UpdateConfirmAutoUnmarkQuery, UpdateConfirmAutoUnmarkCriteria>();
        }
    }
}
