using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using Xunit;
using AutoMapper;
using TicketVoidingSystem.Models;
using Fanex.BetList.Core.Templates;
using TicketVoidingSystem.Services.BetList;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest
{
    public class GetTicketsServiceTests
    {
        private readonly GetTransInfoService getTransInfoService;
        private readonly IMapper mapper;
        private readonly IDynamicRepository repository;

        private readonly GetTicketsServiceImp service;

        public GetTicketsServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            mapper = Substitute.For<IMapper>();
            getTransInfoService = Substitute.For<GetTransInfoService>();
            service = new GetTicketsServiceImp(mapper, repository, getTransInfoService);
        }
    }
}