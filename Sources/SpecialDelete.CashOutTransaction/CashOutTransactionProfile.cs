using AutoMapper;
using Fanex.BetList.Core.Entities;
using SpecialDelete.CashOutTransaction.CancelCashOut.Criteria;
using SpecialDelete.CashOutTransaction.CancelCashOut.Models;
using SpecialDelete.CashOutTransaction.Common.Models;
using SpecialDelete.CashOutTransaction.Common.ViewModels;
using TicketVoidingSystem.Models.SendEmail;

namespace SpecialDelete.CashOutTransaction;

public class CashOutTransactionProfile : Profile
{
    public CashOutTransactionProfile()
    {
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<TicketHtmlViewModel, MailTicketViewModel>();
        CreateMap<VoidTicketsQuery, VoidTicketsCriteria>();
        CreateMap<VoidTicketsQuery, EmailVoidModel>();
    }
}