using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TAKAHATA.Api.Controllers
{
    [AllowAnonymous]
    public class HealthCheckController : ApiController
    {
        public HealthCheckController()
        {

        }

        [HttpGet("/health")]
        public IActionResult Health()
        {
            return Ok("Healthy");
        }
    }
}
