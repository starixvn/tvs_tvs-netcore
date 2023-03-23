using AutoMapper;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.MarkTickets.Criteria.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Criteria.UserLogs;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.UserLogs;
using TicketVoidingSystem.MarkTickets.ViewModels;

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
            CreateMap<TicketViewModel, ExcelTicketModel>();
            CreateMap<GetTicketModel, Ticket>();
            CreateMap<MarkTicketsQuery, MarkTicketsCommand>();
            CreateMap<MarkAllTicketsQuery, MarkAllTicketsCommand>();
            CreateMap<UpdateConfirmAutoUnmarkQuery, UpdateConfirmAutoUnmarkCriteria>();
        }
    }
}