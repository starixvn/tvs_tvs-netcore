using System;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Mvc;

namespace TicketVoidingSystem.ABExceptionList.Controllers
{
    [Route("TicketVoidingSystem/[controller]")]
    public class ABExceptionListController : Controller
    {
        [Route("")]
        [Route("[action]")]
        [NapAuth(FunctionKey = "ABExceptionList", Policy = Constant.Policy.Read)]
        public IActionResult Index()
        {
            return Ok($"xxxx {DateTime.Now}");
        }
    }
}