using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.RecoverByBetId.Models;
using SpecialDelete.RecoverByBetId.ViewModels;

namespace SpecialDelete.RecoverByBetId
{
    public class RecoverByBetIdProfile : Profile
    {
        public RecoverByBetIdProfile()
        {
            CreateMap<GetTicketModel, Ticket>();
            CreateMap<TicketViewModel, MailTicketViewModel>();
        }
    }
}