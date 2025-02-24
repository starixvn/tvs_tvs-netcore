using AutoMapper;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.VoidParlaySub.Criteria;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using BetListCoreTicket = Fanex.BetList.Core.Entities.Ticket;
using SettlementTicket = Settlement.Business.Core.Models.Ticket;

namespace SpecialDelete.VirtualSports;

public class VirtualSportsProfile : Profile
{
    public VirtualSportsProfile()
    {
        CreateMap<GetTicketModel, BetListCoreTicket>();
        CreateMap<VoidTicketsQuery, VoidTicketsCriteria>();
        CreateMap<TicketViewModel, MailTicketViewModel>();
        CreateMap<VoidTicketsQuery, EmailVoidModel>();
        CreateMap<TicketsBetTransModel, SettlementTicket>();
        CreateMap<RecoverTicketsValidation, Result>();
    }
}