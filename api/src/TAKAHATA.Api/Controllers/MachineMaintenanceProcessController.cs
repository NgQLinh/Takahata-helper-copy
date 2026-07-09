using MediatR;

namespace TAKAHATA.Api.Controllers
{
    public class MachineMaintenanceProcessController : ApiController
    {
        private readonly ISender _sender;

        public MachineMaintenanceProcessController(ISender sender)
        {
            _sender = sender;
        }


    }
}
