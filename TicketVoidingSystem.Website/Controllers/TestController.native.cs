namespace TicketVoidingSystem.Website.Controllers
{
	using System.Collections.Generic;
	using System.Net.Http;
	using System.Threading.Tasks;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.Extensions.Configuration;

	[AllowAnonymous]
	public class TestController : Controller
	{
		private readonly IConfiguration configuration;

		public TestController(IConfiguration configuration)
		{
			this.configuration = configuration;
		}

		public async Task<string> Fanex1()
		{
			var fanexService = configuration.GetValue<string>("FanexDataServiceApi");

			var hashset = new HashSet<string>();
			using var httpClient = new HttpClient();
			for (var i = 0; i < 1000; i++)
			{
				var response = await httpClient.GetAsync(fanexService);
				var content = await response.Content.ReadAsStringAsync();
				hashset.Add(content);
				if (hashset.Count >= 2)
				{
					hashset.Add((i + 1).ToString());
					break;
				}
			}

			return string.Join("\n", hashset);
		}

		public async Task<string> Fanex2()
		{
			var fanexService = configuration.GetValue<string>("FanexDataServiceApi");
			var hashset = new HashSet<string>();

			for (var i = 0; i < 1000; i++)
			{
				using var httpClient = new HttpClient();
				var response = await httpClient.GetAsync(fanexService);
				var content = await response.Content.ReadAsStringAsync();
				hashset.Add(content);
				if (hashset.Count >= 2)
				{
					hashset.Add((i + 1).ToString());
					break;
				}
			}

			return string.Join("\n", hashset);
		}
	}
}