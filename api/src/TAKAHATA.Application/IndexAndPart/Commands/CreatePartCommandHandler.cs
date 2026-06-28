using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class CreatePartCommandHandler : IRequestHandler<CreatePartCommand, ErrorOr<IEnumerable<Part>>>
    {
        private readonly IPartRepository _partRepository;

        public CreatePartCommandHandler(IPartRepository partRepository)
        {
            _partRepository = partRepository;
        }

        public async Task<ErrorOr<IEnumerable<Part>>> Handle(
            CreatePartCommand request,
            CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
