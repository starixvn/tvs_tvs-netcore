using AutoMapper;
using Fanex.BetList.Core.Entities;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest;

public class ManageRequestProfile : Profile
{
    public ManageRequestProfile()
    {
        CreateMap<AddRequestQuery, AddRequestCommand>();
        CreateMap<RequestModel, RequestViewModel>();
        CreateMap<RequestModel, RequestEventViewModel>();
        CreateMap<EditRequestQuery, EditRequestCommand>();
        CreateMap<GetPoolHouseTicketQuery, GetPoolHouseTicketCriteria>();
        CreateMap<RequestModel, RequestViewModel>();
        CreateMap<RequestModel, RequestEventViewModel>();
        CreateMap<SelectRequestsQuery, SelectArchivedRequestsCriteria>();
        CreateMap<SelectRequestsQuery, SelectActiveRequestsCriteria>();
        CreateMap<SelectRequestsQuery, GetActiveRequestInfoCriteria>();
        CreateMap<SelectRequestsQuery, GetArchivedRequestInfoCriteria>();
        CreateMap<GetAbnormalBetTicketModel, GetTicketModel>();
        CreateMap<GetAbnormalBetTicketModel, AbnormalBetTicketViewModel>();

        CreateMap<GetTicketsQuery, GetTicketsCriteria>();
        CreateMap<GetTicketsQuery, GetBetTrans14TicketsCriteria>();
        CreateMap<GetVoidedTicketsQuery, GetVoidedTicketsCriteria>();
        CreateMap<GetVoidedTicketsQuery, GetVoidedTickets14Criteria>();
        CreateMap<GetTicketModel, Ticket>();
        CreateMap<VoidedTicketModel, Ticket>();
        CreateMap<TicketViewModel, ExcelTicketModel>();
        CreateMap<TicketViewModel, ExcelTicketNoMatchModel>();
        CreateMap<RequestViewModel, ExcelRequestModel>();
        CreateMap<VoidedTicketViewModel, ExcelVoidedTicketModel>();

        CreateMap<RequestModel, RequestDescription>();
        CreateMap<SubIssueType, IssueInfo>();
        CreateMap<GetLogInfoQuery, GetLogInfoCriteria>();
        CreateMap<MatchInfoAddRequest, Match>();
        CreateMap<Match, MatchInfoAddRequest>();
        CreateMap<RequestEventModel, Match>();
        CreateMap<AddRemarkQuery, AddRemarkCommand>();
        CreateMap<SelectRemarksQuery, SelectActiveRemarksCriteria>();
        CreateMap<SelectRemarksQuery, SelectArchivedRemarksCriteria>();
    }
}